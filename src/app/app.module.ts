import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { JogoPage } from '../pages/jogo/jogo';
import {ConfiguracaoPage} from '../pages/configuracao/configuracao';

import {InicioPage} from '../pages/inicio/inicio';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CompileModule} from "p3x-angular-compile"

@NgModule({
  declarations: [
    MyApp,
    JogoPage,
    InicioPage,
    ConfiguracaoPage
  ],
  imports: [
    CompileModule,
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    JogoPage,
    ConfiguracaoPage,
    InicioPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {}
