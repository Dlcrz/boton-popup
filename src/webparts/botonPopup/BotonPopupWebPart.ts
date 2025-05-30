import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'BotonPopupWebPartStrings';
import BotonPopup from './components/BotonPopup';
import { IBotonPopupProps } from './components/IBotonPopupProps';

export interface IBotonPopupWebPartProps {
}

export default class BotonPopupWebPart extends BaseClientSideWebPart<IBotonPopupWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  protected async onInit(): Promise<void> {
    await this._getEnvironmentMessage();
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IBotonPopupProps> = React.createElement(
      BotonPopup,
      {
        context: this.context,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        spHttpClient: this.context.spHttpClient,
        siteUrl: this.context.pageContext.web.absoluteUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private async _getEnvironmentMessage(): Promise<void> {
    if (!!this.context.sdks.microsoftTeams) {
      const dataProvider = await this.context.sdks.microsoftTeams.teamsJs.app.getContext();
      const environmentMessage = dataProvider.app.host.name;
      this._environmentMessage = environmentMessage === 'Office' ? this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment : environmentMessage === 'Outlook' ? this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment : this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    } else {
      this._environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
    }
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }
    this._isDarkTheme = !!currentTheme.isInverted;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: []
            }
          ]
        }
      ]
    };
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
}
