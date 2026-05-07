import { addDays, subDays } from 'date-fns';

export const members = [
  {
    id: 1,
    name: "Alex Johnson",
    phone: "0569123456",
    avatar: "https://i.pravatar.cc/150?u=1",
    subscriptionEnd: addDays(new Date(), 20), // Active
    plan: "Pro Membership",
    lastCheckIn: "2 hours ago"
  },
  {
    id: 2,
    name: "Sarah Miller",
    phone: "0598765432",
    avatar: "https://i.pravatar.cc/150?u=2",
    subscriptionEnd: addDays(new Date(), 3), // Expiring Soon
    plan: "Basic Plan",
    lastCheckIn: "Yesterday"
  },
  {
    id: 3,
    name: "Mike Ross",
    phone: "0561112223",
    avatar: "https://i.pravatar.cc/150?u=3",
    subscriptionEnd: subDays(new Date(), 2), // Expired
    plan: "Elite Training",
    lastCheckIn: "1 week ago"
  },
  {
    id: 4,
    name: "Emma Wilson",
    phone: "0595556667",
    avatar: "https://i.pravatar.cc/150?u=4",
    subscriptionEnd: addDays(new Date(), 45), // Active
    plan: "Pro Membership",
    lastCheckIn: "Today"
  },
  {
    id: 5,
    name: "Chris Evans",
    phone: "0567778889",
    avatar: "https://i.pravatar.cc/150?u=5",
    subscriptionEnd: addDays(new Date(), 5), // Expiring Soon
    plan: "Basic Plan",
    lastCheckIn: "2 days ago"
  },
  {
    id: 6,
    name: "David Brown",
    phone: "0590001112",
    avatar: "https://i.pravatar.cc/150?u=6",
    subscriptionEnd: subDays(new Date(), 10), // Expired
    plan: "Basic Plan",
    lastCheckIn: "2 weeks ago"
  }
];

