import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Avatar,
  Tooltip,
  IconButton,
  Drawer,
  Alert,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";

const TABLE_HEAD = ["N° compte", "Nom client", "Solde", "Actions"];

export default function Client() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    ncompte: "",
    nomclient: "",
    solde: 0,
  });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", color: "green" });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const toggleDrawer = () => {
    if (!openDrawer) {
      // Générer un numéro de compte aléatoire lors de l'ouverture du drawer en mode ajout
      if (!isEditMode) {
        const randomAccountNumber = generateAccountNumber();
        setFormData({ ...formData, ncompte: randomAccountNumber });
      }
    } else {
      // Réinitialiser le formulaire à la fermeture
      if (!isEditMode) {
        setFormData({ ncompte: "", nomclient: "", solde: 0 });
      }
      setIsEditMode(false);
    }
    setOpenDrawer(!openDrawer);
  };

  // Générer un numéro de compte aléatoire
  const generateAccountNumber = () => {
    const prefix = "FR76";
    const randomDigits = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
    return `${prefix}${randomDigits}`;
  };

  // Récupérer le token du localStorage
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Vérifier si l'utilisateur est un gestionnaire
  const isManager = user.role === 'gestionnaire' || user.role === 'admin';

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/clients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des clients');
      }
      
      const data = await response.json();
      setClients(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        // Mise à jour d'un client existant
        const response = await fetch(`http://localhost:3000/api/clients/${formData.ncompte}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la modification du client');
        }
        
        const updatedClient = await response.json();
        setClients(clients.map(client => 
          client.ncompte === updatedClient.ncompte ? updatedClient : client
        ));
        showAlert("Client modifié avec succès", "green");
      } else {
        // Ajout d'un nouveau client
        const response = await fetch('http://localhost:3000/api/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de l\'ajout du client');
        }
        
        const newClient = await response.json();
        setClients([...clients, newClient]);
        showAlert("Client ajouté avec succès", "green");
      }
      
      setFormData({ ncompte: "", nomclient: "", solde: 0 });
      setIsEditMode(false);
      toggleDrawer();
    } catch (error) {
      console.error('Erreur:', error);
      showAlert(error.message, "red");
    }
  };

  const handleEdit = (client) => {
    setFormData({
      ncompte: client.ncompte,
      nomclient: client.nomclient,
      solde: client.solde
    });
    setIsEditMode(true);
    setOpenDrawer(true);
  };

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/clients/${clientToDelete.ncompte}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du client');
      }
      
      setClients(clients.filter(client => client.ncompte !== clientToDelete.ncompte));
      showAlert("Client supprimé avec succès", "green");
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Erreur:', error);
      console.log(clientToDelete);
      
      showAlert(error.message, "red");
      setOpenDeleteDialog(false);
    }
  };

  const showAlert = (message, color) => {
    setAlert({ show: true, message, color });
    setTimeout(() => {
      setAlert({ show: false, message: "", color: "green" });
    }, 3000);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  /// Filtrer les clients en fonction de la recherche
const filteredClients = clients.filter(client => 
  String(client.ncompte).toLowerCase().includes(searchQuery.toLowerCase()) ||
  String(client.nomclient).toLowerCase().includes(searchQuery.toLowerCase())
);


  if (loading) return <div className="flex justify-center p-8"><Typography>Chargement des clients...</Typography></div>;
  if (error) return <div className="flex justify-center p-8"><Typography color="red">{error}</Typography></div>;

  return (
    <div>
      {alert.show && (
        <Alert color={alert.color} className="mb-4">
          {alert.message}
        </Alert>
      )}
      
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
              <Button variant="outlined" size="sm" onClick={fetchClients}>
                Actualiser
              </Button>
              {isManager && (
                <Button
                  className="flex items-center gap-3"
                  size="sm"
                  onClick={toggleDrawer}
                >
                  Ajouter un client
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="w-full md:w-72">
              <Input
                label="Rechercher"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0 w-[950px]">
          <table className="mt-4 w-full min-w-max table-auto text-left">
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
              {filteredClients.map((client, index) => {
                const isLast = index === filteredClients.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={client.ncompte}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {client.ncompte}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(client.nomclient)}&background=random`} 
                          alt={client.nomclient} 
                          size="sm" 
                        />
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {client.nomclient}
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
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(client.solde)}
                      </Typography>
                    </td>
                    <td className={classes}>
                      {isManager && (
                        <div className="flex gap-2">
                          <Tooltip content="Modifier le client">
                            <IconButton variant="text" color="blue" onClick={() => handleEdit(client)}>
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Supprimer le client">
                            <IconButton variant="text" color="red" onClick={() => handleDeleteClick(client)}>
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            {filteredClients.length} clients au total
          </Typography>
        </CardFooter>
      </Card>

      {/* Drawer pour ajouter/modifier un client */}
      <Drawer
        placement="right"
        open={openDrawer}
        onClose={toggleDrawer}
        className="overflow-scroll w-96"
      >
        <div className="p-4">
          <Typography variant="h6" color="blue-gray">
            {isEditMode ? "Modifier un Client" : "Ajouter un Client"}
          </Typography>
          <form>
            <div className="mt-4">
              <Input 
                label="Numéro de Compte" 
                name="ncompte"
                value={formData.ncompte}
                onChange={handleInputChange} 
                size="lg"
                disabled={isEditMode} // Désactiver la modification du numéro de compte en mode édition
              />
            </div>
            <div className="mt-4">
              <Input 
                label="Nom du Client" 
                name="nomclient"
                value={formData.nomclient}
                onChange={handleInputChange} 
                size="lg" 
              />
            </div>
            <div className="mt-4">
              <Input 
                label="Solde" 
                name="solde"
                type="number"
                value={formData.solde}
                onChange={handleInputChange} 
                size="lg" 
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outlined" onClick={toggleDrawer}>
                Annuler
              </Button>
              <Button variant="filled" onClick={handleSubmit}>
                {isEditMode ? "Modifier" : "Ajouter"}
              </Button>
            </div>
          </form>
        </div>
      </Drawer>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={openDeleteDialog} handler={() => setOpenDeleteDialog(!openDeleteDialog)}>
        <DialogHeader>Confirmation de suppression</DialogHeader>
        <DialogBody>
         
        Êtes-vous sûr de vouloir supprimer le client {clientToDelete?.nomclient} avec le numéro de compte {clientToDelete?.ncompte} ?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={() => setOpenDeleteDialog(false)}
            className="mr-1"
          >
            Annuler
          </Button>
          <Button variant="gradient" color="red" onClick={confirmDelete}>
            Confirmer
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
