import {Page, Locator} from '@playwright/test';
import {testConfig} from '../config/testConfig';

export class LoginPage {
    //페이지 객체 및 요소 선언
    readonly page: Page;
    readonly idInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page){
        this.page = page;
        this.idInput = page.getByRole('textbox', {name:'아이디'});
        this.passwordInput = page.getByRole('textbox', {name:'비밀번호'});
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