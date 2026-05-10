// types/next-auth.d.ts e 'user' interface ta eivabe thik korun
interface Session {
  accessToken?: string;
  user: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;      // Eita add korun
    employee_id?: string; // Eita add korun
  };
}