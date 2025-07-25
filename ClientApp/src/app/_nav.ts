import { INavData } from '@coreui/angular';

export const smsOperator: INavData[] = [
  {
    divider: true
  },
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'bi bi-clipboard-data',
  },
  {
    name: 'Manage VMN',
    url: '/ManageVMN',
    icon: 'bi bi-chat-right-fill'
    
  },
  {
    name: 'Configuration',
    url: '/Configuration',
    icon: 'fa fa-cogs',
    // icon: 'fa fa-messages',
    
  },
  {
    name: 'Report',
    url: '/Report',
    icon: 'bi bi-file-earmark-text',
    children: [
      {
        name: 'VMN List',
        url: '/Report/VMNList',
        icon: 'bi bi-person-circle ml-3'
      },
      {
        name: 'Summary',
        url: '/Report/Summary',
        icon: 'bi bi-list-columns-reverse ml-3'
      },
      {
        name: 'Detailed',
        url: '/Report/Detailed',
        icon: 'bi bi-arrow-right-circle-fill ml-3'
      }
    ]
  }
  ,
  // {
  //   name: 'Error Codes',
  //   url: '/errorcodes',
  //   icon: 'bi bi-exclamation-diamond',
  // }
]

export const smsOperator_end: INavData[] = [
  {
    divider: true
  },
  
  {
    name: 'reports',
    url: '/reports/vmnlist',
    icon: 'bi bi-file-earmark-text',
    children: [
      {
        name: '',
        url: '/reports/detailedreport',
        icon: 'bi bi-person-circle ml-3'
      },
      {
        name: 'Summary',
        url: '/reports/Summaryreport',
        icon: 'bi bi-person-circle ml-3'
      },
      {
        name: 'VMNlist',
        url: '/reports/vmnlist',
        icon: 'bi bi-arrow-right-circle-fill ml-3'
      }
    ]
  }
  ,
  // {
  //   name: 'Error Codes',
  //   url: '/errorcodes',
  //   icon: 'bi bi-exclamation-diamond',
  // }
]






