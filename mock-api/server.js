
const http = require('node:http');

// 프로젝트 데이터를 메모리에 저장
const projects = new Map();

// 프로젝트 ID 자동 증가
let nextId = 1;

// HTTP 서버 생성
const server = http.createServer(async (req, res) => {

  // JSON 응답을 반환하는 공통 함수
  const send = (status, data) => {
    res.writeHead(status, {
      'Content-Type': 'application/json; charset=utf-8'
    });

    res.end(JSON.stringify(data));
  };

  // 1. 프로젝트 생성 API
  if (req.method === 'POST' && req.url === '/projects') {
    try {
      let body = '';

      // 클라이언트가 보낸 요청 데이터 읽기
      for await (const chunk of req) {
        body += chunk;
      }

      // JSON 문자열을 객체로 변환
      const { name } = JSON.parse(body);

      // 프로젝트 이름 필수값 검사
      if (typeof name !== 'string' || !name.trim()) {
        return send(400, {
          message: 'Project name is required'
        });
      }

      // 프로젝트 이름 중복 검사
      const isDuplicate = [...projects.values()]
        .some(project => project.name === name);

      if (isDuplicate) {
        return send(409, {
          message: 'Duplicate project name'
        });
      }

      // 프로젝트 생성
      const project = {
        id: nextId++,
        name: name
      };

      // 메모리에 저장
      projects.set(project.id, project);

      // 생성 결과 반환
      return send(201, project);

    } catch {
      return send(400, {
        message: 'Invalid JSON'
      });
    }
  }

  // 2. 프로젝트 목록 조회 API
  if (req.method === 'GET' && req.url === '/projects') {
    return send(200, [...projects.values()]);
  }

  // 3. 프로젝트 ID로 개별 조회
  if (req.method === 'GET' && /^\/projects\/\d+$/.test(req.url)){
    const id = Number(req.url.split('/')[2]);

    const project = projects.get(id);

    if(!project){
      return send(404, {
        message: 'Project not found'
      })
    }

    return send(200, project);
  }

  // 4. 프로젝트 수정 API
  if (req.method === 'PUT' && /^\/projects\/\d+$/.test(req.url)) {
    const id = Number(req.url.split('/')[2]);

    // 수정할 프로젝트 조회
    const project = projects.get(id);

    if (!project) {
      return send(404, {
        message: 'Project not found'
      });
    }

    try {
      let body = '';

      for await (const chunk of req) {
        body += chunk;
      }

      const { name } = JSON.parse(body);

      // 필수값 검증
      if (typeof name !== 'string' || !name.trim()) {
        return send(400, {
          message: 'Project name is required'
        });
      }

      // 다른 프로젝트와 이름이 중복되는지 확인
      const isDuplicate = [...projects.values()].some(
        p => p.id !== id && p.name === name
      );

      if (isDuplicate) {
        return send(409, {
          message: 'Duplicate project name'
        });
      }

      // 프로젝트 이름 수정
      project.name = name;
      projects.set(id, project);

      return send(200, project);

    } catch {
      return send(400, {
        message: 'Invalid JSON'
      });
    }
  }

  // 5. 프로젝트 삭제 API
  if(req.method === 'DELETE' && /^\/projects\/\d+$/.test(req.url)){
    const id = Number(req.url.split('/')[2]);

    // 삭제할 프로젝트 존재 여부 확인
    const project = projects.get(id);
    
    if(!project){
      return send(404, {
        message:'Project not found'
      })
    }

    // 실제 데이터 삭제
    projects.delete(id);

    // 204 No Content : 응답 Body 없음
    res.writeHead(204);
    return res.end();
  }

  // 존재하지 않는 API
  return send(404, {
      message: 'Not found'
  });
});

// 로컬 서버 실행
server.listen(3001, '127.0.0.1', () => {
  console.log('Mock API running at http://127.0.0.1:3001');
});
