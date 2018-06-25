import { Component,  } from '@angular/core';
import { NavController, Platform, LoadingController, Content, ModalController } from 'ionic-angular';

import { JogoPage } from '../jogo/jogo';

import { ConfiguracaoPage } from '../configuracao/configuracao';

@Component({
  templateUrl: 'inicio.html'
})
export class InicioPage {

  constructor(public modalCtrl: ModalController) {

  } 

  novoJogo(){
    let profileModal = this.modalCtrl.create(ConfiguracaoPage);
    profileModal.onDidDismiss(data => {
        console.log(data);
      });
   
   profileModal.present();

  }
}
