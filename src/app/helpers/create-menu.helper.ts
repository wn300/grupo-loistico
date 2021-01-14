import { MODULE } from '../constants/app.constants';
import { NavItem } from '../core/nav-menu/entity/nav-meu';

export const createMenu = (permissions: {
  [key: string]: string[];
}): NavItem[] => {
  const menu: NavItem[] = [
    {
      displayName: 'Inicio',
      iconName: 'dashboard',
      route: '/containers/home',
    },
  ];
  if (permissions) {
    if (permissions[MODULE.management]) {
      const childrens = [];
      if (permissions[MODULE.management][MODULE.companies]) {
        childrens.push({
          displayName: 'Empresas',
          iconName: '',
          route: '/containers/administration/company',
        });
      }
      if (permissions[MODULE.management][MODULE.clients]) {
        childrens.push({
          displayName: 'Clientes',
          iconName: '',
          route: '/containers/administration/client',
        });
      }
      if (permissions[MODULE.management][MODULE.workCenters]) {
        childrens.push({
          displayName: 'Centros de trabajo',
          iconName: '',
          route: '/containers/administration/work_center',
        });
      }
      if (permissions[MODULE.management][MODULE.people]) {
        childrens.push({
          displayName: 'Personas',
          iconName: '',
          route: '/containers/administration/people',
        });
      }
      if (permissions[MODULE.management][MODULE.images]) {
        childrens.push({
          displayName: 'Imagenes',
          iconName: '',
          route: '/containers/administration/delete_files',
        });
      }
      if (permissions[MODULE.management][MODULE.newTypes]) {
        childrens.push({
          displayName: 'Tipos de novedad',
          iconName: '',
          route: '/containers/administration/types-news',
        });
      }
      if (childrens.length > 0) {
        menu.push({
          displayName: 'Administración',
          iconName: 'supervisor_account',
          route: '/containers/administration',
          children: childrens,
        });
      }
    }
    if (permissions[MODULE.programming]) {
      menu.push({
        displayName: 'Programacion',
        iconName: 'vertical_split',
        route: '/containers/programming',
      });
    }
    if (permissions[MODULE.news]) {
      menu.push({
        displayName: 'Novedades',
        iconName: 'rule',
        route: '/containers/news',
      });
    }
    if (permissions[MODULE.reports]) {
      menu.push({
        displayName: 'Reportes',
        iconName: 'article',
        route: '/containers/reports',
        children: [
          {
            displayName: 'Aplicación',
            iconName: '',
            route: '/containers/reports/app',
          },
          {
            displayName: 'Programación',
            iconName: '',
            route: '/containers/reports/programming',
          },
          {
            displayName: 'No Programados',
            iconName: '',
            route: '/containers/reports/not-scheduled',
          },
        ],
      });
    }
  }
  return menu;
};
