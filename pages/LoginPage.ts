import {Page, Locator} from '@playwright/test';
import {testConfig} from '../config/testConfig';

/*
    POM(Page Object Model) : 특정 페이지에서 사용하는 Locator와 동작을 하나의 클래스로 묶어 재사용하는 설계 패턴...
    Locator 뿐만 ㅇ니라 그 페이지에서 수행하는 동작까지 캡슐화!
*/

export class LoginPage {
    //페이지 객체 및 요소 선언
    readonly page: Page;
    readonly idInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page){
        this.page = page;
        this.idInput = page.getByRole('textbox', {name:'아이디'});
        this.passwordInput = page.getByLabel('비밀번호');
        this.loginButton = page.getByRole('button', {name:'로그인'});
    }

    //로그인 화면 이동
    async goto(){
        await this.page.goto(
            new URL('/login', testConfig.url).toString()
        )
    }

    //로그인 수행
    async login(id: string, password: string){
        await this.idInput.fill(id);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}