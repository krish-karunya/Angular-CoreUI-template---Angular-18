import { INavData } from '@coreui/angular';
import { Role } from '../../constants/_roles';

export const navItems: INavData[] = [
  {
    name: 'Sys Admin',
    url: '/sysadmin',
    icon: 'fa fa-shield',
    attributes: {
      roles: [Role.SystemAdministrator],
    },
    children: [
      {
        name: 'Organizations',
        url: '/sysadmin/organizations',
        icon: 'fa fa-building',
        attributes: {
          roles: [Role.SystemAdministrator],
        },
      },
      {
        name: 'Teaching Manual',
        url: '/sysadmin/teachingManual',
        icon: 'fa fa-newspaper-o',
        attributes: {
          roles: [Role.SystemAdministrator],
        },
      },
    ],
  },
  {
    name: 'Administration',
    url: '/admin',
    icon: 'icon-settings',
    attributes: {
      roles: [
        Role.SystemAdministrator,
        Role.DivisionAdministrator,
        Role.OrganizationAdministrator,
        Role.Supervisor,
      ],
    },
    children: [
      {
        name: 'Organization',
        url: '/admin/organization-edit',
        icon: 'fa fa-building',
        attributes: {
          roles: [
            Role.SystemAdministrator,
            Role.DivisionAdministrator,
            Role.OrganizationAdministrator,
          ],
        },
      },
      {
        name: 'Divisions',
        url: '/admin/divisions',
        icon: 'icon-home',
        attributes: {
          roles: [
            Role.SystemAdministrator,
            Role.DivisionAdministrator,
            Role.OrganizationAdministrator,
          ],
        },
      },
      {
        name: 'Subdivisions',
        url: '/admin/subdivisions',
        icon: 'fa fa-th-large',
        attributes: {
          roles: [
            Role.SystemAdministrator,
            Role.DivisionAdministrator,
            Role.OrganizationAdministrator,
          ],
        },
      },
      {
        name: 'Users',
        url: '/admin/users',
        icon: 'icon-people',
        attributes: {
          roles: [
            Role.SystemAdministrator,
            Role.DivisionAdministrator,
            Role.OrganizationAdministrator,
            Role.Supervisor,
          ],
        },
      },
    ],
  },
  {
    name: 'Content',
    url: '/content',
    icon: 'fa fa-file-image-o',
    attributes: {
      roles: [Role.Supervisor, Role.ContentEditor, Role.SystemAdministrator],
    },
    children: [
      {
        name: 'Programs',
        url: '/content/programs',
        icon: 'fa fa-table',
        attributes: {
          roles: [
            Role.Supervisor,
            Role.ContentEditor,
            Role.SystemAdministrator,
          ],
        },
      },
      {
        name: 'TaskSharing',
        url: '/content/task-sharing',
        icon: 'fa fa-table',
        attributes: {
          roles: [Role.SystemAdministrator],
        },
      },
      {
        name: 'Modules',
        url: '/content/modules',
        icon: 'fa fa-th-list',
        attributes: {
          roles: [
            Role.Supervisor,
            Role.ContentEditor,
            Role.SystemAdministrator,
          ],
        },
      },
      {
        name: 'Tasks',
        url: '/content/tasks',
        icon: 'fa fa-list-ul',
        attributes: {
          roles: [
            Role.Supervisor,
            Role.ContentEditor,
            Role.SystemAdministrator,
          ],
        },
      },
      //{
      //  name: 'TaskList',
      //  url: '/content/taskList',
      //  icon: 'fa fa-list-ul',
      //  attributes: {
      //    roles: [Role.Supervisor, Role.ContentEditor, Role.SystemAdministrator]
      //  }
      //},
      {
        name: 'Task Steps',
        url: '/content/tasksteps',
        icon: 'fa fa-th',
        attributes: {
          roles: [
            Role.Supervisor,
            Role.ContentEditor,
            Role.SystemAdministrator,
          ],
        },
      },
      {
        name: 'Media',
        url: '/content/media',
        icon: 'fa fa-picture-o',
        attributes: {
          roles: [
            Role.Supervisor,
            Role.ContentEditor,
            Role.SystemAdministrator,
          ],
        },
      },
      {
        name: 'Ratings',
        url: '/content/rating-systems',
        icon: 'fa fa-star',
        attributes: {
          roles: [
            Role.Supervisor,
            Role.ContentEditor,
            Role.SystemAdministrator,
          ],
        },
      },
      {
        name: 'Classrooms',
        url: '/content/Classrooms',
        icon: 'fa fa-university',
        attributes: {
          roles: [
            Role.Supervisor,
            Role.ContentEditor,
            Role.SystemAdministrator,
          ],
        },
      },
    ],
  },
  {
    name: 'Training',
    url: '/training',
    icon: 'fa fa-graduation-cap',
    attributes: {
      roles: [Role.Trainer, Role.Supervisor],
    },
    children: [
      {
        name: 'Plan Training',
        url: '/training/plan-training',
        icon: 'fa fa-calendar-o',
        attributes: {
          roles: [Role.Trainer, Role.Supervisor],
        },
      },
      {
        name: 'View Evaluations',
        url: '/training/eval-list',
        icon: 'fa fa-bar-chart',
        attributes: {
          roles: [Role.Trainer, Role.Supervisor],
        },
      },
      {
        name: 'Train',
        url: '/training/train-task',
        icon: 'fa fa-book',
        attributes: {
          roles: [Role.Trainer, Role.Supervisor],
        },
      },
      {
        name: 'Mobile Train',
        url: '/mobile/train',
        icon: 'fa fa-mobile',
        attributes: {
          roles: [Role.Trainer, Role.Supervisor],
        },
      },
      {
        name: 'Class Setup',
        url: '/training/class-setup',
        icon: 'fa fa-book',
        attributes: {
          roles: [Role.Trainer, Role.Supervisor],
        },
      },
    ],
  },
  {
    name: 'Learning',
    url: '/learning',
    icon: 'fa fa-book',
    attributes: {
      roles: [Role.Trainee],
    },
    children: [
      {
        name: 'Learn',
        url: '/learning/learn',
        icon: 'fa fa-book',
        attributes: {
          roles: [Role.Trainee],
        },
      },
      {
        name: 'Practice',
        url: '/learning/practice',
        icon: 'fa fa-forumbee',
        attributes: {
          roles: [Role.Trainee],
        },
      },
    ],
  },
  {
    name: 'Reports',
    url: '/reporting',
    icon: 'fa fa-file-text-o',
    attributes: {
      roles: [Role.Trainer, Role.Supervisor, Role.Reporting],
    },
    children: [
      //{
      //  name: 'Progress Report',
      //  url: '/reporting/progress',
      //  icon: 'fa fa-bar-chart',
      //  attributes: {
      //    roles: [Role.Trainer, Role.Supervisor, Role.Reporting]
      //  }
      //},
      {
        name: 'Progress Report',
        url: '/reporting/progressB',
        icon: 'fa fa-bar-chart',
        attributes: {
          roles: [Role.Trainer, Role.Supervisor, Role.Reporting],
        },
      },
      {
        name: 'Count Report',
        url: '/reporting/unitprogress',
        icon: 'fa fa-bar-chart',
        attributes: {
          roles: [Role.Trainer, Role.Supervisor, Role.Reporting],
        },
      },
      {
        name: 'Training Sessions',
        url: '/reporting/training-experience',
        icon: 'fa fa-bar-chart',
        attributes: {
          roles: [Role.Trainer, Role.Supervisor, Role.Reporting],
        },
      },
      {
        name: 'Error Analysis',
        url: '/reporting/error-analysis',
        icon: 'fa fa-bar-chart',
        attributes: {
          roles: [Role.Trainer, Role.Supervisor, Role.Reporting],
        },
      },
      {
        name: 'Measure Speed',
        url: '/reporting/measurespeed',
        icon: 'fa fa-bar-chart',
        attributes: {
          roles: [Role.Trainer, Role.Supervisor, Role.Reporting],
        },
      },
      {
        name: 'Prompt Level',
        url: '/reporting/promptlevelprogress',
        icon: 'fa fa-table',
        attributes: {
          roles: [Role.Trainer, Role.Supervisor, Role.Reporting],
        },
      },
      {
        name: 'Treament Fidelity',
        url: '/reporting/treatmentFidelity',
        icon: 'fa fa-table',
        attributes: {
          roles: [Role.Trainer, Role.Supervisor, Role.Reporting],
        },
      },
      {
        name: 'Class List',
        url: '/reporting/class-list',
        icon: 'fa fa-bar-chart',
        attributes: {
          roles: [Role.Supervisor, Role.Reporting],
        },
      },
    ],
  },
];
