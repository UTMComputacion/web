import { Component } from '@angular/core';
import Swal from "sweetalert2";
import { Router } from '@angular/router';
//importamos el servicio
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from "../../models/usuario";
import { environment } from 'src/app/environments/environment';
import { CorreoService } from 'src/app/services/correo.service';
import { ImagenesService } from 'src/app/services/imagenes.service';
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  //creamos la varible
  liga: string = environment.API_URI_IMAGENES;
  imgPrincipal: any;
  fileToUpload: any;
  usuario = new Usuario();
  constructor(private imagenesService: ImagenesService, private correoService: CorreoService, private usuarioService: UsuarioService, private router: Router) {
    this.imgPrincipal = null
  }
  modalCambiarContrasenya() {
    console.log("modalCambiarContrasenya");
    $('#modalCambiarContrasenya').modal({ dismissible: false });
    $('#modalCambiarContrasenya').modal('open');
  }
  cambiarContrasenya() {
    console.log(this.usuario);

    this.correoService.enviarCorreoRecuperarContrasenya(this.usuario).subscribe((resUsuario: any) => {
      console.log(resUsuario);
    }, (err: any) => console.error(err));
  }
  cargandoImagen(files: any, carpeta: any) {
    console.log(files.files[0]);

    this.imgPrincipal = null;
    this.fileToUpload = files.files[0];
    let imgPromise = this.getFileBlob(this.fileToUpload);
    imgPromise.then(blob => {
      console.log(blob);

      this.imagenesService.guardarImagen(345, blob, carpeta).subscribe(
        (res: any) => {
          this.imgPrincipal = blob;
        },
        err => console.error(err));
    })
  }
  getFileBlob(file: any) {
    var reader = new FileReader();
    return new Promise(function (resolve, reject) {
      reader.onload = (function (thefile) {
        return function (e: any) {
          resolve(e.target.result);
        };
      })(file);
      reader.readAsDataURL(file);
    });
  }
  dameNombre(id: any) {
    console.log("hola");

    return this.liga + "/perfil/" + id + ".jpg"
  }
  onImgError(event: any) {
    event.target.src = this.liga + "/perfil/0.png";
  }
  verificarUsuario() {

    this.usuarioService.VerificarUsuario(this.usuario.correo, this.usuario.password).subscribe((resUsuario: any) => {
      console.log(resUsuario);
      if (resUsuario == null) {
        console.log("el usuario no existe")
        Swal.fire({
          position: "center",
          icon: "error",
          title: "correo o contraseña inválido",
          showConfirmButton: true
        })
      } else {
        console.log("el usuario existe");
        localStorage.setItem("tipoUsuario", resUsuario.tipo + " ")        // agrega variables de entorno, es como diccionario
        this.router.navigate(['home/clientes'])
      }
    },
      (err: any) => console.error(err)
    );
  }
}