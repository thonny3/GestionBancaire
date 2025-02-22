import { useState } from "react";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Avatar, Tooltip, IconButton } from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Drawer } from "@material-tailwind/react"; // Importer Drawer

const TABLE_HEAD = ["N° compte", "Nom client", "Solde", ""];

const TABLE_ROWS = [
  {
    accountNumber: "12345678",
    name: "John Michael",
    balance: "$5,000",
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
  },
  {
    accountNumber: "23456789",
    name: "Alexa Liras",
    balance: "$3,200",
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg",
  },
  {
    accountNumber: "34567890",
    name: "Laurent Perrier",
    balance: "$8,500",
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg",
  },
  {
    accountNumber: "45678901",
    name: "Michael Levi",
    balance: "$1,000",
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg",
  },
  {
    accountNumber: "56789012",
    name: "Richard Gran",
    balance: "$7,000",
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg",
  },
];

export default function Client() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    numCompt: "",
    solde: null,
  });
  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  const getNumero = (e) => {
    setFormData({ ...formData, numCompt: e.target.value });
  };
  const getSolde = (e) => {
    setFormData({ ...formData, solde: e.target.value });
  };

  const getNom = (e) => {
    setFormData({ ...formData, nom: e.target.value });
  };
  const handleSubmit = ()=>{
    console.log(formData);
    
  }

  return (
    <div>
      <Card className="px-10">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Liste des clients
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Voir les informations de tous les clients
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button variant="outlined" size="sm">
                Voir tout
              </Button>
              <Button
                className="flex items-center gap-3"
                size="sm"
                onClick={toggleDrawer}
              >
                Ajouter un client
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="w-full md:w-72">
              <Input
                label="Rechercher"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0 w-[950px]">
          <table className="mt-4 w-full  min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}{" "}
                      {index !== TABLE_HEAD.length - 1 && (
                        <ChevronUpDownIcon
                          strokeWidth={2}
                          className="h-4 w-4"
                        />
                      )}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map(
                ({ accountNumber, name, balance, img }, index) => {
                  const isLast = index === TABLE_ROWS.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={name}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {accountNumber}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar src={img} alt={name} size="sm" />
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {name}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {balance}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Supprimer l'utilisateur">
                          <IconButton variant="text" color="red">
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page 1 of 10
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm">
              Previous
            </Button>
            <Button variant="outlined" size="sm">
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Drawer pour ajouter un client */}
      <Drawer
        placement="right"
        open={openDrawer}
        onClose={toggleDrawer}
        className="overflow-scroll w-96"
      >
        <div className="p-4">
          <Typography variant="h6" color="blue-gray">
            Ajouter un Client
          </Typography>
          <form>
            <div className="mt-4">
              <Input label="Numéro de Compte" size="lg" onChange={getNumero} />
            </div>
            <div className="mt-4">
              <Input label="Nom du Client" size="lg" onChange={getNom} />
            </div>
            <div className="mt-4">
              <Input label="Solde" size="lg" onChange={getSolde} />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outlined" onClick={toggleDrawer}>
                Annuler
              </Button>
              <Button variant="filled" onClick={handleSubmit}>
                Ajouter
              </Button>
            </div>
          </form>
        </div>
      </Drawer>
    </div>
  );
}
