import React, { useState } from 'react';
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { Drawer, Button, Input, Card, CardHeader, CardBody, Typography, CardFooter, IconButton, Tooltip } from "@material-tailwind/react";

const TABLE_HEAD = ["N° Virement", "N° Compte", "Montant", "Date Virement", "Action"];
const TABLE_ROWS = [
  {
    virementNo: "001",
    accountNo: "12345",
    amount: "500",
    date: "12/03/2025",
  },
  {
    virementNo: "002",
    accountNo: "67890",
    amount: "1000",
    date: "14/03/2025",
  },
  {
    virementNo: "003",
    accountNo: "11223",
    amount: "2000",
    date: "15/03/2025",
  },
];

export default function Virement() {
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  return (
    <div>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Liste des virements
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Voir les informations de tous les virements
              </Typography>
            </div>
            <Button className="flex items-center gap-3" size="sm" onClick={toggleDrawer}>
              Ajouter un virement
            </Button>
          </div>
        </CardHeader>

        <CardBody className=" px-0 w-[1000px] ">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map(({ virementNo, accountNo, amount, date }, index) => (
                <tr key={virementNo}>
                  <td className="p-4 border-b border-blue-gray-50">{virementNo}</td>
                  <td className="p-4 border-b border-blue-gray-50">{accountNo}</td>
                  <td className="p-4 border-b border-blue-gray-50">{amount} €</td>
                  <td className="p-4 border-b border-blue-gray-50">{date}</td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <div className="flex gap-2">
                      <Tooltip content="Mettre à jour">
                        <IconButton variant="text" color='blue'>
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Supprimer">
                        <IconButton variant="text" color='red'>
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>

        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page 1 de 10
          </Typography>
        </CardFooter>
      </Card>

      {/* Drawer pour ajouter un virement */}
      <Drawer
        placement="right"
        open={openDrawer}
        onClose={toggleDrawer}
        className="overflow-scroll w-96"
      >
        <div className="p-4">
          <Typography variant="h6" color="blue-gray">
            Ajouter un Virement
          </Typography>
          <form>
            <div className="mt-8">
              <Input label="Numéro de Compte" size="lg" />
            </div>
            <div className="mt-8">
              <Input label="Montant" size="lg" />
            </div>
            <div className="mt-8">
              <Input label="Date du Virement" size="lg" type="date" />
            </div>
            <div className="mt-8 flex justify-end gap-2">
              <Button variant="outlined" onClick={toggleDrawer}>
                Annuler
              </Button>
              <Button variant="filled">Ajouter</Button>
            </div>
          </form>
        </div>
      </Drawer>
    </div>
  );
}
