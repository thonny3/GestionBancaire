import React, { useState, useEffect } from "react";
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
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";

const TABLE_HEAD = ["ID", "Type d'action", "N° Virement", "N° Compte", "Nom Client", "Montant Ancien", "Montant Nouveau", "Date", "Utilisateur"];

export function Audit() {
  const [auditData, setAuditData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   // Récupérer le token du localStorage
   const token = localStorage.getItem('token');
   const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('http://localhost:3000/api/audit', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }); // Added closing parenthesis here
        
        if (!response.ok) {
          throw new Error('Erreur réseau');
        }
        
        const data = await response.json();
        setAuditData(data);
        setFilteredData(data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des données d'audit");
        setLoading(false);
        console.error(err);
      }
    };
  
    fetchAuditData();
  }, []);

  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(auditData);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = auditData.filter(item => 
        (item.type_action && item.type_action.toLowerCase().includes(lowercasedQuery)) ||
        (item.nomclient && item.nomclient.toLowerCase().includes(lowercasedQuery)) ||
        (item.utilisateur && item.utilisateur.toLowerCase().includes(lowercasedQuery)) ||
        (item.nvirement && item.nvirement.toString().includes(lowercasedQuery)) ||
        (item.ncompte && item.ncompte.toString().includes(lowercasedQuery))
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, auditData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Journal d'Audit des Virements
            </Typography>
            <Typography color="gray" className="mt-1 mb-8 font-normal">
              Historique des actions effectuées sur les virements
            </Typography>
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max ">
            <div className="w-full md:w-72">
              <Input
                label="Rechercher"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0 ">
        {loading ? (
          <Typography className="text-center py-4">Chargement des données...</Typography>
        ) : error ? (
          <Typography className="text-center py-4 text-red-500">{error}</Typography>
        ) : (
          <table className="w-full min-w-max table-auto text-left">
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
                      {head}
                      {index !== TABLE_HEAD.length - 1 && (
                        <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                      )}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_HEAD.length} className="text-center p-4">
                    <Typography>Aucune donnée d'audit trouvée</Typography>
                  </td>
                </tr>
              ) : (
                filteredData.map(({ id, type_action, nvirement, ncompte, nomclient, Montant_ancien, Montant_nouv, date_audit, utilisateur }, index) => {
                  const isLast = index === filteredData.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={id}>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {id}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {type_action}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {nvirement}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {ncompte || "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {nomclient || "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {Montant_ancien || "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {Montant_nouv || "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {formatDate(date_audit)}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {utilisateur}
                        </Typography>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page 1 de 1
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm">
            Précédent
          </Button>
          <Button variant="outlined" size="sm">
            Suivant
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
