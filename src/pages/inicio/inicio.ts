import { Component, } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { JogoPage } from '../jogo/jogo';
import { ConfiguracaoPage } from '../configuracao/configuracao';

@Component({
  templateUrl: 'inicio.html'
})
export class InicioPage {

  constructor(public modalCtrl: ModalController, private navCtrl: NavController) {

  }

  novoJogo() {
    this.pararThread();
    let profileModal = this.modalCtrl.create(ConfiguracaoPage);
    profileModal.onDidDismiss(data => {
      console.log(data);
    });

    profileModal.present();

  }

  pararThread() {
    //Parar thread contador
    clearInterval(parseInt(localStorage.getItem('idContador')));
    localStorage.setItem('idContador', '');
  }

  continuarJogo() {
    this.pararThread();
    this.navCtrl.push(JogoPage);
  }

  verificarExiteJogoPendente() {
    return localStorage.getItem('configuracaoJogo') ? false : true;
  }
}
