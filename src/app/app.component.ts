import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioControllerService } from './api/services/usuario-controller.service'
import { HttpClientModule, HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  httpClient = inject(HttpClient)
  public mostrarCadastro = true;
  formGroup!: FormGroup;
  mensagem: string = '';

  constructor(
    private fb: FormBuilder,
    private loginService: UsuarioControllerService,
    private cadastroService: UsuarioControllerService
  ) {
      this.createForm();
    }

  createForm() {
    this.formGroup = this.fb.group({
      email: ['', Validators.required],
      senha: ['', Validators.required],
    });
  }

    ngOnInit() { }

  toggleCadastroLogin() {
    this.mostrarCadastro = !this.mostrarCadastro;
    this.formGroup.get('nome')?.updateValueAndValidity(); // Update validation
  }

  onSubmit() {
	  console.log("Foi :)");
    if (this.mostrarCadastro) {
          this.cadastroService.cadastro({body: this.formGroup.value})
            .subscribe(response => {
              this.mensagem = 'Cadastro realizado com sucesso!';
            }, error => {
              this.mensagem = 'Erro ao realizar cadastro.';
              console.error(error);
            });
        } else {
          this.loginService.login({body: this.formGroup.value})
            .subscribe(response => {
              // Process login success (e.g., redirect)
              console.log('Login realizado com sucesso!');
            }, error => {
              this.mensagem = 'Erro ao realizar login.';
              console.error(error);
            });
        }
    }
}
