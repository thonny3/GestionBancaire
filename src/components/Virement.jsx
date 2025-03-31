import React, { useState, useEffect } from 'react';
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { 
  Drawer, 
  Button, 
  Input, 
  Card, 
  CardHeader, 
  CardBody, 
  Typography, 
  CardFooter, 
  IconButton, 
  Tooltip,
  Alert
} from "@material-tailwind/react";

const TABLE_HEAD = ["N° Virement", "N° Compte", "Client", "Montant", "Date Virement", "Action"];

export default function Virement() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [virements, setVirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    ncompte: '',
    Montant: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentVirementId, setCurrentVirementId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', color: 'green' });

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
    if (!openDrawer) {
      // Reset form when opening drawer
      setFormData({ ncompte: '', Montant: '' });
      setEditMode(false);
      setCurrentVirementId(null);
    }
  };

  const showAlert = (message, color = 'green') => {
    setAlert({ show: true, message, color });
    setTimeout(() => setAlert({ show: false, message: '', color: 'green' }), 3000);
  };

  // Fetch all virements
  const fetchVirements = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/virements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des virements');
      }
      
      const data = await response.json();
      setVirements(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      showAlert(err.message, 'red');
    } finally {
      setLoading(false);
    }
  };

  // Load virements on component mount
  useEffect(() => {
    fetchVirements();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editMode 
        ? `http://localhost:3000/api/virements/${currentVirementId}`
        : 'http://localhost:3000/api/virements';
      
      const method = editMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Une erreur est survenue');
      }
      
      // Refresh virements list
      await fetchVirements();
      
      // Close drawer and show success message
      toggleDrawer();
      showAlert(editMode ? 'Virement mis à jour avec succès' : 'Virement ajouté avec succès');
    } catch (err) {
      showAlert(err.message, 'red');
    }
  };

  // Handle edit virement
  const handleEdit = (virement) => {
    setFormData({
      ncompte: virement.ncompte,
      Montant: virement.Montant
    });
    setEditMode(true);
    setCurrentVirementId(virement.nvirement);
    setOpenDrawer(true);
  };

  // Handle delete virement
  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce virement?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/virements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }
      
      // Refresh virements list
      await fetchVirements();
      showAlert('Virement supprimé avec succès');
    } catch (err) {
      showAlert(err.message, 'red');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div>
      {alert.show && (
        <Alert color={alert.color} className="mb-4">
          {alert.message}
        </Alert>
      )}
      
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

        <CardBody className="px-0 w-[1000px]">
          {loading ? (
            <Typography className="p-4">Chargement des virements...</Typography>
          ) : error ? (
            <Typography className="p-4 text-red-500">{error}</Typography>
          ) : (
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
                {virements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center">
                      Aucun virement trouvé
                    </td>
                  </tr>
                ) : (
                  virements.map((virement) => (
                    <tr key={virement.nvirement}>
                      <td className="p-4 border-b border-blue-gray-50">{virement.nvirement}</td>
                      <td className="p-4 border-b border-blue-gray-50">{virement.ncompte}</td>
                      <td className="p-4 border-b border-blue-gray-50">{virement.nomclient}</td>
                      <td className="p-4 border-b border-blue-gray-50">{virement.Montant} €</td>
                      <td className="p-4 border-b border-blue-gray-50">{formatDate(virement.date_virement)}</td>
                      <td className="p-4 border-b border-blue-gray-50">
                        <div className="flex gap-2">
                          <Tooltip content="Mettre à jour">
                            <IconButton variant="text" color='blue' onClick={() => handleEdit(virement)}>
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Supprimer">
                            <IconButton variant="text" color='red' onClick={() => handleDelete(virement.nvirement)}>
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </CardBody>

        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            {virements.length} virement(s) au total
          </Typography>
        </CardFooter>
      </Card>

      {/* Drawer pour ajouter/modifier un virement */}
      <Drawer
        placement="right"
        open={openDrawer}
        onClose={toggleDrawer}
        className="overflow-scroll w-96"
      >
        <div className="p-4">
          <Typography variant="h6" color="blue-gray">
            {editMode ? 'Modifier le Virement' : 'Ajouter un Virement'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <div className="mt-8">
              <Input 
                label="Numéro de Compte" 
                size="lg" 
                name="ncompte"
                value={formData.ncompte}
                onChange={handleInputChange}
                required
                disabled={editMode}
              />
            </div>
            <div className="mt-8">
              <Input 
                label="Montant" 
                size="lg" 
                name="Montant"
                type="number"
                value={formData.Montant}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mt-8 flex justify-end gap-2">
              <Button variant="outlined" onClick={toggleDrawer}>
                Annuler
              </Button>
              <Button variant="filled" type="submit">
                {editMode ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </div>
          </form>
        </div>
      </Drawer>
    </div>
  );
}
