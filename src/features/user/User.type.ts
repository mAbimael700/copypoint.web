import { Person } from "../person/Person.type";
export interface UserResponse {
  id: string;
  username: string;
  email: string;
  personalInfo?: Person
  creationDate: Date
}

export default UserResponse