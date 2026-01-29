import { IApplicationUserRow, IRoleRow } from '../services/user.service';

export class UserParams {
    organizationID: number;
    userId: string;
    firstName: string;
    lastName: string;
    userName: string;
    displayName: string;

    constructor(user: IApplicationUserRow) {
      this.organizationID = user.organizationId;
      this.userId = user.id;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.userName = user.userName;
      this.displayName = user.firstName + ' ' + user.lastName;
    }
}

export class UserRoles {
  userId: string;
  roles: IRoleRow[];

  constructor(user: IApplicationUserRow) {
    this.userId = user.id;
    this.roles = user.roles;
  }
}
