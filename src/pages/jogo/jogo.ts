import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, LoadingController, Content, AlertController } from 'ionic-angular';
import * as $ from 'jquery';
import wiki from 'wikijs';

@Component({
  selector: 'page-jogo',
  templateUrl: 'jogo.html'
})


export class JogoPage {

  @ViewChild(Content) content: Content;

  innerHtmlVar: string = "";

  tooltip: string = "";

  loading;

  configuracaoJogo = localStorage.getItem('configuracaoJogo') ? JSON.parse(localStorage.getItem('configuracaoJogo')) : new Object();

  constructor(public navCtrl: NavController, public plt: Platform, public loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    
  }

  ionViewDidLoad() {
    this.sortearBurraco();
    this.carregarLoading();
    this.incrementarTacada();
    this.iniciarJogo(this.configuracaoJogo.paginaWiki);
    localStorage.setItem('idContador', setInterval(() => {this.iniciarContador()}, 1000).toString());
  }

  sortearBurraco() {
    wiki({ apiUrl: 'http://pt.wikipedia.org/w/api.php' }).random(1).then(
      results => {
        wiki({ apiUrl: 'http://pt.wikipedia.org/w/api.php' }).page(!this.configuracaoJogo.burraco ? results[0] : this.configuracaoJogo.burraco).then(
          resultado => {
            resultado.content().then(conteudo => {
              this.configuracaoJogo.burraco = !this.configuracaoJogo.burraco ? results[0] : this.configuracaoJogo.burraco;
              this.salvarConfiguracaoJogo();
              $("#burraco").html(this.configuracaoJogo.burraco);
              this.tooltip = conteudo.small().substring(0, 400);
            })
          })

      })
  }

  salvarConfiguracaoJogo() {
    localStorage.setItem('configuracaoJogo', JSON.stringify(this.configuracaoJogo));
  }

  iniciarContador() {
    var tempoAtual = !this.configuracaoJogo.tempo ? parseInt($("#tempo").text()) : this.configuracaoJogo.tempo;
    this.configuracaoJogo.tempo = tempoAtual + 1;
    this.salvarConfiguracaoJogo();
    $("#tempo").html((tempoAtual + 1).toString());
  }

  irProximaPagina(pagina: string) {
    this.carregarLoading();
    this.content.scrollToTop();
    if (pagina != $("#burraco").text()) {
      wiki({ apiUrl: 'http://pt.wikipedia.org/w/api.php' }).page(pagina).then(
        resultado => {
          this.limparCampos();
          this.incrementarTacada();
          this.configuracaoJogo.paginaWiki = pagina;
          this.salvarConfiguracaoJogo();
          this.pesquisarWiki(pagina);
        }).catch(e => {
          let alert = this.alertCtrl.create({
            title: 'Selecione outro link',
            subTitle: 'Página na wikipedia não encontrada.',
            buttons: ['Fechar']
          });
          alert.present();
          this.loading.dismiss();
        });
    } else {
      let alert = this.alertCtrl.create({
        title: 'Parabens',
        subTitle: 'Pontuação XXX',
        buttons: ['Fechar']
      });
      alert.present();
    }
  }

  incrementarTacada() {
    if (!this.configuracaoJogo.tacada) {
      var tacadaAtual = parseInt($("#tacada").text());
      this.configuracaoJogo.tacada = tacadaAtual + 1;
      this.salvarConfiguracaoJogo();
      $("#tacada").html((tacadaAtual + 1).toString());
    } else {
      $("#tacada").html(this.configuracaoJogo.tacada.toString());
    }
  }

  limparCampos() {
    $('titulo').html('');
    $('#imagem').attr('src', '');
    this.innerHtmlVar = '';
  }

  carregarLoading() {
    this.loading = this.loadingCtrl.create({
      content: '<img src="assets/imgs/golfLoading.gif" height="158" width="222"/>',
      spinner: 'hide',
      cssClass: 'transparent'
    });

    this.loading.present();
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

  apresentarToolTipBurraco() {
    let alert = this.alertCtrl.create({
      title: 'Ajuda Burraco',
      subTitle: this.tooltip,
      buttons: ['Fechar']
    });
    alert.present();
  }

  removerCaracteresInvalidos(conteudo: string) {
    conteudo = conteudo.split(/&/g).join("&amp;").split(/>/g).join("&gt;").split(/</g).join("&lt;").split(/"/g).join("&quot;").split(/'/g).join("&#039;").split('$').join('').split('{').join('').split('}').join('');
    return conteudo;
  }

  adicionarLinks(conteudo: string, links: string[]) {
    links.sort(function (a, b) { return a.length + b.length });
    for (let index = 0; index < links.length; index++) {
      const link = links[index];
      var posicao = conteudo.search(link.split(' ')[0]);
      var stringPosicao = conteudo.substring(posicao - 100, posicao + 100);
      var valor = stringPosicao.lastIndexOf('<');
      valor = valor + stringPosicao.lastIndexOf('>');
      if (valor <= -1) {
        conteudo = conteudo.replace(link, '<a (click)="context.irProximaPagina(\'' + link + '\')">' + link + '</a>');
      }
    }
    return conteudo;
  }

  adicionarImagens(conteudo: string, imgs: string[]): any {
    conteudo = conteudo.replace(/(?:\r\n|\r|\n)/g, '<br>');
    imgs.forEach(img => {
      if (img.lastIndexOf('svg') == -1)
        conteudo = conteudo.replace('<br><br>', '<br><img src="' + img + '" style="display: block;margin-left: auto;margin-right: auto; width: 40%;"/>');
    });
    return conteudo;
  }

  pesquisarWiki(parametro: string) {
    wiki({ apiUrl: 'http://pt.wikipedia.org/w/api.php' }).page(parametro).then(
      resultado => {
        resultado.images().then(img => {
          $("#imagem").attr("src", img[0])
          $('#titulo').html(parametro);
          resultado.links().then(
            links => {
              resultado.content().then(
                conteudo => {
                  conteudo = this.removerCaracteresInvalidos(conteudo);
                  conteudo = this.adicionarLinks(conteudo, links);
                  conteudo = this.adicionarImagens(conteudo, img);
                  this.innerHtmlVar = conteudo;
                  this.loading.dismiss();
                }
              )
            }
          );
        });
      }
    ).catch(e => this.iniciarJogo(null));
  }
}
