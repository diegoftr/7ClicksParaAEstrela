import { Component } from '@angular/core';
import { NavController, Platform, Content, ViewController } from 'ionic-angular';
import { JogoPage } from '../jogo/jogo';

@Component({
  templateUrl: 'configuracao.html'
})
export class ConfiguracaoPage {

  constructor(public viewCtrl: ViewController, private navCtrl: NavController) {

  }

  fechar() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }

  novoJogo() {
    localStorage.setItem('configuracaoJogo', '');
    this.navCtrl.push(JogoPage);
    this.viewCtrl.dismiss();
  }
}
