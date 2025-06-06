import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { IBotonPopupProps, IListItem } from './IBotonPopupProps';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
//import { DefaultButton } from '@fluentui/react/lib/Button';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Image, ImageFit } from '@fluentui/react/lib/Image';
import styles from './BotonPopup.module.scss';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

interface ISharePointListItem {
  ID: number;
  Title: string;
  Boton1: string;
  Imagen1: string;
  ImagenCentral: string;
  Boton2: string;
  Imagen2: string;
  Link2: string;
  Boton3?: string;
  Imagen3?: string;
  Link3?: string;
}

export default function BotonPopup(props: IBotonPopupProps): React.ReactElement<IBotonPopupProps> {
  const [openDialogs, setOpenDialogs] = useState<{ [key: string]: boolean }>({});
  const [listItems, setListItems] = useState<IListItem[]>([]);

  const getListItems = useCallback(async (): Promise<void> => {
    try {
      const baseUrl = `${props.siteUrl}/_api/web/lists/getbytitle('boton popup')/items`;
      const select = '$select=ID,Title,Boton1,Imagen1,Boton2,Boton3,ImagenCentral,Imagen2,Imagen3,Link2,Link3';
      const queryUrl = `${baseUrl}?${select}`;

      //console.log('URL de consulta:', queryUrl);

      const response: SPHttpClientResponse = await props.spHttpClient.get(
        queryUrl,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const items: { value: ISharePointListItem[] } = await response.json();
      //console.log('Respuesta de SharePoint:', items);

      const processedItems = items.value.map(item => {
        const processedItem = {
          Title: item.Title,
          Boton1: item.Boton1,
          Imagen1: '',
          ImagenCentral: '',
          Boton2: item.Boton2,
          Imagen2: '',
          Link2: item.Link2,
          Boton3: item.Boton3,
          Imagen3: '',
          Link3: item.Link3
        };

        try {
          const imagen1Data = JSON.parse(item.Imagen1);
          processedItem.Imagen1 = `${props.siteUrl}/Lists/boton%20popup/Attachments/${item.ID}/${imagen1Data.fileName}`;
        } catch (e) {
          console.warn('No se pudo parsear Imagen1:', item.Imagen1);
        }

        try {
          const imagenCentralData = JSON.parse(item.ImagenCentral);
          processedItem.ImagenCentral = `${props.siteUrl}/Lists/boton%20popup/Attachments/${item.ID}/${imagenCentralData.fileName}`;
        } catch (e) {
          console.warn('No se pudo parsear ImagenCentral:', item.ImagenCentral);
        }

        try {
          const imagen2Data = JSON.parse(item.Imagen2);
          processedItem.Imagen2 = `${props.siteUrl}/Lists/boton%20popup/Attachments/${item.ID}/${imagen2Data.fileName}`;
        } catch (e) {
          console.warn('No se pudo parsear Imagen2:', item.Imagen2);
        }

        if (item.Imagen3) {
          try {
            const imagen3Data = JSON.parse(item.Imagen3);
            processedItem.Imagen3 = `${props.siteUrl}/Lists/boton%20popup/Attachments/${item.ID}/${imagen3Data.fileName}`;
          } catch (e) {
            console.warn('No se pudo parsear Imagen3:', item.Imagen3);
          }
        }

        return processedItem;
      });

      setListItems(processedItems);
    } catch (error) {
      console.error('Error al obtener datos de la lista:', error);
    }
  }, [props.spHttpClient, props.siteUrl]);

  useEffect(() => {
    getListItems().catch(console.error);
  }, [getListItems]);

  const toggleDialog = (title: string): void => {
    setOpenDialogs(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className={styles.botonPopup}>
      <div className={styles.buttonGrid}>
        {listItems.map((item, index) => (
          <div key={index} className={styles.buttonContainer}>
            <PrimaryButton
              onClick={() => toggleDialog(item.Title)}
              className={styles.mainButton}
            >
              {item.Imagen1 && (
                <Image
                  src={item.Imagen1}
                  width={20}
                  height={20}
                  imageFit={ImageFit.contain}
                  className={styles.buttonIcon}
                />
              )}
              {item.Boton1}
            </PrimaryButton>

            <Dialog
              hidden={!openDialogs[item.Title]}
              onDismiss={() => toggleDialog(item.Title)}
              dialogContentProps={{
                type: DialogType.normal,
                title: item.Title,
                closeButtonAriaLabel: 'Cerrar',
                showCloseButton: true
              }}
              modalProps={{
                isBlocking: false,
                className: styles.botonPopup // ✅ Aplica tus estilos personalizados desde aquí
              }}
            >
              <div className={styles.dialogContent}>
                {item.ImagenCentral && (
                  <img
                    src={item.ImagenCentral}
                    className={styles.centralImage}

                  />
                )}

                {(item.Boton2 && item.Imagen2) || (item.Boton3 && item.Imagen3) ? (
                  <DialogFooter className={styles.dialogFooter}>
                    {item.Boton2 && item.Imagen2 && (
                      <PrimaryButton
                        href={item.Link2}
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(item.Link2, '_blank', 'noopener,noreferrer');
                        }}
                        className={styles.footerButton}
                        style={{ borderRadius: 4 }}
                      >
                        <Image
                          src={item.Imagen2}
                          width={24}
                          height={24}
                          imageFit={ImageFit.contain}
                          className={styles.buttonIcon}
                        />
                        <span>{item.Boton2}</span>
                      </PrimaryButton>
                    )}

                    {item.Boton3 && item.Imagen3 && (
                      <PrimaryButton
                        href={item.Link3}
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(item.Link3, '_blank', 'noopener,noreferrer');
                        }}
                        className={styles.footerButton}
                        style={{ borderRadius: 4 }}
                      >
                        <Image
                          src={item.Imagen3}
                          width={24}
                          height={24}
                          imageFit={ImageFit.contain}
                          className={styles.buttonIcon}
                        />
                        <span>{item.Boton3}</span>
                      </PrimaryButton>
                    )}
                  </DialogFooter>
                ) : null}
              </div>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
}
