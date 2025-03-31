import React, { useState, useEffect } from "react";
import {
  UserGroupIcon,
  PlusCircleIcon,
  TrashIcon,
  PencilIcon,
  BanknotesIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import { Typography, Card } from "@material-tailwind/react";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    audit: {
      ajout: 0,
      modification: 0,
      suppression: 0
    },
    statistiques: {
      totalClients: 0,
      totalVirements: 0,
      montantTotal: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        
        const data = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Définir les statistiques à afficher basées sur les données récupérées
  const stats = [
    {
      title: "Clients",
      count: dashboardData.statistiques.totalClients,
      icon: <UserGroupIcon className="w-10 h-10 text-blue-500" />,
    },
    {
      title: "Virements",
      count: dashboardData.statistiques.totalVirements,
      icon: <BanknotesIcon className="w-10 h-10 text-purple-500" />,
    },
    {
      title: "Montant Total",
      count: dashboardData.statistiques.montantTotal ? 
        `${dashboardData.statistiques.montantTotal.toLocaleString()} €` : 
        "0 €",
      icon: <ArrowPathIcon className="w-10 h-10 text-indigo-500" />,
    },
    {
      title: "Ajouts",
      count: dashboardData.audit.ajout,
      icon: <PlusCircleIcon className="w-10 h-10 text-green-500" />,
    },
    {
      title: "Modifications",
      count: dashboardData.audit.modification,
      icon: <PencilIcon className="w-10 h-10 text-yellow-500" />,
    },
    {
      title: "Suppressions",
      count: dashboardData.audit.suppression,
      icon: <TrashIcon className="w-10 h-10 text-red-500" />,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded-lg">
        <h2 className="text-xl font-bold">Erreur</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="">
      <Card className=" mb-6 bg-white shadow-lg">
        <Typography variant="h4" className="font-semibold text-gray-800 mb-4">
          Tableau de bord
        </Typography>
        <Typography variant="paragraph" className="text-gray-600 mb-4">
          Bienvenue sur le tableau de bord de gestion bancaire. Voici un aperçu des statistiques actuelles.
        </Typography>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-2xl p-6 flex items-center space-x-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-4 bg-gray-100 rounded-full">{stat.icon}</div>
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-xl font-semibold text-gray-800">
                {stat.count}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
