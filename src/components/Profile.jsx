import React from 'react';
import { Avatar, Typography, Card, CardBody } from '@material-tailwind/react';

export default function Profile({ user }) {
  return (
    <Card className="w-full max-w-lg mx-auto p-10">
      <CardBody className="flex flex-col items-center text-center">
        {/* Avatar et icône */}
        <Avatar
          src={user.profileImage || 'https://via.placeholder.com/150'}
          alt={user.name}
          size="xl"
          className="mb-4"
        />
        {/* Nom de l'utilisateur */}
        <Typography variant="h5" color="blue-gray" className="font-medium">
          {user.name}
        </Typography>
        {/* Rôle de l'utilisateur */}
        <Typography color="gray" className="mt-2">
          {user.role === 'admin' ? 'Administrateur' : 'Gestionnaire'}
        </Typography>
        {/* Email de l'utilisateur */}
        <Typography color="gray" className="mt-2">
          {user.email}
        </Typography>
      </CardBody>
    </Card>
  )
}
