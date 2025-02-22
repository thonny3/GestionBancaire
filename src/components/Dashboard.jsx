import {
  UserGroupIcon,
  PlusCircleIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { Typography, Chip, Card } from "@material-tailwind/react";

export default function Dashboard() {
  const stats = [
    {
      title: "Clients",
      count: 120,
      icon: <UserGroupIcon className="w-10 h-10 text-blue-500" />,
    },
    {
      title: "Ajouts",
      count: 35,
      icon: <PlusCircleIcon className="w-10 h-10 text-green-500" />,
    },
    {
      title: "Suppressions",
      count: 15,
      icon: <TrashIcon className="w-10 h-10 text-red-500" />,
    },
    {
      title: "Modifications",
      count: 22,
      icon: <PencilIcon className="w-10 h-10 text-yellow-500" />,
    },
  ];
  const TABLE_HEAD = ["N° Compte", "Nom", "Prénom", "Montant", "Action"];

  const TABLE_ROWS = [
    {
      accountNumber: "12345",
      firstName: "John",
      lastName: "Doe",
      amount: "$100",
      action: "Ajout",
    },
    {
      accountNumber: "67890",
      firstName: "Jane",
      lastName: "Smith",
      amount: "$200",
      action: "Suppression",
    },
    {
      accountNumber: "11223",
      firstName: "Alice",
      lastName: "Brown",
      amount: "$150",
      action: "Modification",
    },
    {
      accountNumber: "44556",
      firstName: "Bob",
      lastName: "Johnson",
      amount: "$50",
      action: "Ajout",
    },
    {
      accountNumber: "78901",
      firstName: "Charlie",
      lastName: "Davis",
      amount: "$120",
      action: "Suppression",
    },
  ];

  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-2xl p-6 flex items-center space-x-6 border border-gray-200"
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
      <Card className="h-full w-full bg-white shadow-lg mt-5">
        <Typography variant="h4" className="font-semibold text-gray-800 ml-5">
          Les 5 derniers mis à jour Virements
        </Typography>
        <table className="w-full min-w-max table-auto text-left mt-5">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map(
              (
                { accountNumber, firstName, lastName, amount, action },
                index
              ) => {
                const isLast = index === TABLE_ROWS.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={accountNumber}>
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
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {firstName}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {lastName}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {amount}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <span className="px-5">
                        {" "}
                        <Chip
                          value={action}
                          color={
                            action === "Ajout"
                              ? "green"
                              : action === "Suppression"
                              ? "red"
                              : "blue"
                          }
                          className="capitalize w-22"
                        />
                      </span>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
