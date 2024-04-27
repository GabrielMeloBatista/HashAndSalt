import {Component, HostListener, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioControllerService } from './api/services/usuario-controller.service'
import crypto from 'crypto-js';
import {UsuarioDto} from './api/models'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public mostrarCadastro = true;
  formGroup!: FormGroup;
  mensagem: string = '';
  salt: number = 256789;

  constructor(
    private fb: FormBuilder,
    private loginService: UsuarioControllerService,
    private cadastroService: UsuarioControllerService
  ) {
      this.createForm();
    }

  createForm() : void {
    this.formGroup = this.fb.group({
      email: ['', Validators.required],
      senha: ['', Validators.required],
    });
  }

    ngOnInit(): void { }

  toggleCadastroLogin() : void {
    this.mostrarCadastro = !this.mostrarCadastro;
  }

  // Função que Criptografa uma string, retornando uma hash segura
  encriptData(data: string): string {
    // Biblioteca Crypto e padrão do node e não precisa ser instalada.
    return crypto.SHA256(data).toString();
  }

  // Captura o movimento do mouse, gerando salt aleatorios a cada movimento do mouse
  @HostListener('document:mousemove', ['$event'])
  async onmousemove(event: MouseEvent) {
    let mouseEntropy = event.clientX + event.clientY;
    let randomSalt = await this.generateRandomSalt();
    this.salt = mouseEntropy ^ randomSalt;
  }

  // Função que gera salt aleatorio
  async generateRandomSalt() {
    if(window.crypto && window.crypto.getRandomValues) {
      let array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0];
    }
    else {
      // caso a biblioteca assima falhe, usa a biblioteca padrão, não recomendado mas e para evitar do programa de falhar
      return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    }
  }

  onSubmit() : void {
    // tecnica para evitar que o formulario mostre o hash para o usuario, e fique apenas com as informações de login na tela.
    const usuario: UsuarioDto = {};

    usuario.email = this.encriptData(this.formGroup.get('email')?.value);
    usuario.senha = this.encriptData(this.formGroup.get('senha')?.value);

    if (this.mostrarCadastro) {
          this.cadastroService.cadastro({body: usuario})
            .subscribe((response) => {
              this.mensagem = 'Cadastro realizado com sucesso! Salt:' + this.salt.toString();
            }, error => {
              this.mensagem = 'Erro ao realizar cadastro.';
              console.error(error);
            });
        } else {
          this.loginService.login({body: usuario})
            .subscribe((response) => {
              // Process login success (e.g., redirect)
              this.mensagem = 'Login realizado com sucesso!';
            }, error => {
              this.mensagem = 'Erro ao realizar login.';
              console.error(error);
            });
        }
    }
}
