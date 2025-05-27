import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient } from "@microsoft/sp-http";

export interface IBotonPopupProps {
  listName: string;
  context: WebPartContext;
  isDarkTheme: boolean;
  environmentMessage: string;
  spHttpClient: SPHttpClient;
  siteUrl: string;
}

export interface IListItem {
  Title: string;
  Boton1: string;
  Imagen1: string;
  ImagenCentral: string;
  Boton2: string;
  Imagen2: string;
  Boton3?: string;
  Imagen3?: string;
}
