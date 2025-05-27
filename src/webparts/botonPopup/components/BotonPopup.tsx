import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { IBotonPopupProps, IListItem } from './IBotonPopupProps';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Image, ImageFit } from '@fluentui/react/lib/Image';
import { Icon } from '@fluentui/react/lib/Icon';
import styles from './BotonPopup.module.scss';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export default function BotonPopup(props: IBotonPopupProps): React.ReactElement<IBotonPopupProps> {
  const [isOpen, setIsOpen] = useState(false);
  const [listItem, setListItem] = useState<IListItem | null>(null);

  const getListItem = useCallback(async (): Promise<void> => {
    try {
      const response: SPHttpClientResponse = await props.spHttpClient.get(
        `${props.siteUrl}/_api/web/lists/getbytitle('${props.listName}')/items?$select=Title,Boton1,Imagen1,ImagenCentral,Boton2,Imagen2,Boton3,Imagen3&$top=1`,
        SPHttpClient.configurations.v1
      );

      const items: { value: IListItem[] } = await response.json();
      if (items.value.length > 0) {
        setListItem(items.value[0]);
      }
    } catch (error) {
      console.error('Error al obtener datos de la lista:', error);
    }
  }, [props.spHttpClient, props.siteUrl, props.listName]);

  useEffect(() => {
    void getListItem();
  }, [getListItem]);

  const dialogContentProps = {
    type: DialogType.normal,
    title: listItem?.Title || '',
    closeButtonAriaLabel: 'Cerrar',
    showCloseButton: true
  };

  return (
    <div className={styles.botonPopup}>
      {listItem && (
        <>
          <DefaultButton
            onClick={() => setIsOpen(true)}
            className={styles.mainButton}
          >
            <Image
              src={listItem.Imagen1}
              width={20}
              height={20}
              imageFit={ImageFit.contain}
              className={styles.buttonIcon}
            />
            {listItem.Boton1}
          </DefaultButton>

          <Dialog
            hidden={!isOpen}
            onDismiss={() => setIsOpen(false)}
            dialogContentProps={dialogContentProps}
            modalProps={{
              isBlocking: false,
              styles: { main: { maxWidth: 450 } }
            }}
          >
            <div className={styles.dialogContent}>
              <Image
                src={listItem.ImagenCentral}
                className={styles.centralImage}
                imageFit={ImageFit.contain}
              />
              
              <DialogFooter>
                <DefaultButton
                  href="#"
                  onClick={() => window.open(listItem.Imagen2, '_blank')}
                  className={styles.footerButton}
                >
                  <Image
                    src={listItem.Imagen2}
                    width={20}
                    height={20}
                    imageFit={ImageFit.contain}
                    className={styles.buttonIcon}
                  />
                  {listItem.Boton2}
                </DefaultButton>

                {listItem.Boton3 && (
                  <DefaultButton
                    href="#"
                    onClick={() => window.open(listItem.Imagen3, '_blank')}
                    className={styles.footerButton}
                  >
                    <Image
                      src={listItem.Imagen3}
                      width={20}
                      height={20}
                      imageFit={ImageFit.contain}
                      className={styles.buttonIcon}
                    />
                    {listItem.Boton3}
                  </DefaultButton>
                )}
              </DialogFooter>
            </div>
          </Dialog>
        </>
      )}
    </div>
  );
}
