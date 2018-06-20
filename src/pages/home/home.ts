import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { Platform } from 'ionic-angular';
import * as $ from 'jquery';
import wiki from 'wikijs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
@NgModule({
})
export class HomePage {

  innerHtmlVar:string = "";

  constructor(public navCtrl: NavController, public plt: Platform) {
    
    this.iniciarJogo(localStorage.getItem('teste'));
  }

  irProximaPagina(pagina: string) {
    localStorage.setItem('teste', pagina);
    location.reload();
  }

  iniciarJogo(parametro: string) {
    if (!parametro) {
      wiki({ apiUrl: 'http://pt.wikipedia.org/w/api.php' }).random(1).then(
        results => {
          this.pesquisarWiki(results[0]);
          
        }
      );
    } else {
      this.pesquisarWiki(parametro);
    }
  }

  error(e) {
    console.log(e)
  }

  pesquisarWiki(parametro: string) {
    wiki({ apiUrl: 'http://pt.wikipedia.org/w/api.php' }).page(parametro).then(
      resultado => {

        resultado.mainImage().then(img => document.getElementById('imagem').src = img);

        document.getElementById('titulo').innerHTML = parametro;
        
        resultado.links().then(
          links => {
            resultado.content().then(
              conteudo => {
                console.log('tamanho - ' + links.length);
                for (let index = 0; index < links.length; index++) {
                  const link = links[index];
                  conteudo = conteudo.replace(link, '<a (click)="context.irProximaPagina(\'' + link + '\')">' + link + '</a>');
                }
                conteudo = conteudo.replace(/(?:\r\n|\r|\n)/g, '<br>');
                localStorage.setItem('teste', '');
                this.innerHtmlVar =  conteudo;
              }
            )
          }
        );
      }
    ).catch(e => this.iniciarJogo(null));
  }
}
