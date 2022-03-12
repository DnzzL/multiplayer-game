

interface Role {
  name: string
  description: string
}

/* eslint-disable-next-line */
export interface RoleProps {
  role: Role
}

export function Role({ role }: RoleProps) {
  return (
    <div >
      <h1>{role.name}</h1>
      <p>{role.description}</p>
    </div>
  );
}

export default Role;
