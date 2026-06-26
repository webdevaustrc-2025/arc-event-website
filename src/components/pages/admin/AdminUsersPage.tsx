"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Search,
  Filter,
  MoreVertical,
  Check,
  X,
  Shield,
  Users,
  Loader2,
  Download,
} from "lucide-react";

type AdminUserRow = {
  id: number;
  name: string;
  email: string;
  team: string;
  role: string;
  status: string;
  segment: string;
  paymentStatus?: string;
  registeredAt?: string;
};

const mockUsers: AdminUserRow[] = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    team: "CyberKnights",
    role: "Captain",
    status: "Approved",
    segment: "Robo Wars",
    paymentStatus: "Paid",
    registeredAt: "",
  },
  {
    id: 2,
    name: "Sam Smith",
    email: "sam@example.com",
    team: "MechMinds",
    role: "Member",
    status: "Pending",
    segment: "Line Follower",
    paymentStatus: "Pending",
    registeredAt: "",
  },
  {
    id: 3,
    name: "Jordan Lee",
    email: "jordan@example.com",
    team: "ScrapBots",
    role: "Captain",
    status: "Rejected",
    segment: "Drone Racing",
    paymentStatus: "Unpaid",
    registeredAt: "",
  },
  {
    id: 4,
    name: "Taylor Swift",
    email: "taylor@example.com",
    team: "SparkPlugs",
    role: "Member",
    status: "Approved",
    segment: "Hackathon",
    paymentStatus: "Paid",
    registeredAt: "",
  },
  {
    id: 5,
    name: "Casey Jones",
    email: "casey@example.com",
    team: "CircuitBreakers",
    role: "Captain",
    status: "Pending",
    segment: "Robo Wars",
    paymentStatus: "Pending",
    registeredAt: "",
  },
  {
    id: 6,
    name: "Riley Reid",
    email: "riley@example.com",
    team: "CircuitBreakers",
    role: "Member",
    status: "Pending",
    segment: "Robo Wars",
    paymentStatus: "Pending",
    registeredAt: "",
  },
  {
    id: 7,
    name: "Morgan Freeman",
    email: "morgan@example.com",
    team: "AutoBots",
    role: "Captain",
    status: "Approved",
    segment: "AI Challenge",
    paymentStatus: "Paid",
    registeredAt: "",
  },
];

function formatStatus(status?: string) {
  if (!status) return "Pending";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function formatDate(date?: string) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleString();
}

function escapeCsvValue(value: string | number | undefined | null) {
  const safeValue = value === undefined || value === null ? "" : String(value);

  if (
    safeValue.includes(",") ||
    safeValue.includes('"') ||
    safeValue.includes("\n") ||
    safeValue.includes("\r")
  ) {
    return `"${safeValue.replace(/"/g, '""')}"`;
  }

  return safeValue;
}

export default function AdminUsersPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("All");
  const [users, setUsers] = useState<AdminUserRow[]>(mockUsers);
  const [loading, setLoading] = useState(false);

  // Avoid hydration mismatch: default to dark (matches ThemeProvider defaultTheme)
  // until the component mounts and reads the real theme from localStorage
  const isDark = !mounted || resolvedTheme !== "light";

  useEffect(() => {
    setMounted(true);
  }, []);

  const cardBg = isDark
    ? "bg-[#111116] border-white/[0.07]"
    : "bg-white border-black/[0.08]";

  const inputBg = isDark
    ? "bg-[#18181f] border-white/[0.07] text-[#F5F5F0]"
    : "bg-[#F0EDE6] border-black/[0.08] text-[#1a1a14]";

  const textColor = isDark ? "text-[#F5F5F0]" : "text-[#1a1a14]";
  const mutedText = isDark ? "text-[#9A9A8E]" : "text-[#4a4a40]";

  const loadUsersAndTeams = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/registrations", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch registrations");
      }

      const result = await response.json();

      const registrations = Array.isArray(result)
        ? result
        : result?.data || result?.items || result?.registrations || [];

      if (!Array.isArray(registrations) || registrations.length === 0) {
        setUsers(mockUsers);
        return;
      }

      const mappedUsers: AdminUserRow[] = registrations.map((reg: any) => ({
        id: reg.id,
        name: reg.user?.name || "Participant",
        email: reg.user?.email || "No Email",
        team: reg.teamName || "Individual",
        role: reg.user?.role === "admin" ? "Admin" : "Captain",
        status: formatStatus(reg.status),
        segment: reg.segment?.name || "Not Specified",
        paymentStatus: formatStatus(reg.paymentStatus),
        registeredAt: formatDate(reg.createdAt),
      }));

      setUsers(mappedUsers);
    } catch (error) {
      console.error("Failed to load users and teams:", error);
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsersAndTeams();
  }, []);

  const segmentOptions = Array.from(
    new Set(users.map((user) => user.segment).filter(Boolean)),
  ).sort();

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      user.name.toLowerCase().includes(search) ||
      user.team.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.segment.toLowerCase().includes(search) ||
      user.status.toLowerCase().includes(search) ||
      user.role.toLowerCase().includes(search);

    const matchesSegment =
      selectedSegment === "All" || user.segment === selectedSegment;

    return matchesSearch && matchesSegment;
  });

  const exportUsersAndTeams = (exportFilteredOnly = false) => {
    const dataToExport = exportFilteredOnly ? filteredUsers : users;

    if (dataToExport.length === 0) {
      alert("No users or teams available to export.");
      return;
    }

    const headers = [
      "Registration ID",
      "Participant Name",
      "Email",
      "Team",
      "Role",
      "Status",
      "Segment",
      "Payment Status",
      "Registered At",
    ];

    const rows = dataToExport.map((user) => [
      user.id,
      user.name,
      user.email,
      user.team,
      user.role,
      user.status,
      user.segment,
      user.paymentStatus || "",
      user.registeredAt || "",
    ]);

    const csvContent = [
      headers.map(escapeCsvValue).join(","),
      ...rows.map((row) => row.map(escapeCsvValue).join(",")),
    ].join("\n");

    const utf8Bom = "\uFEFF";
    const blob = new Blob([utf8Bom + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const today = new Date().toISOString().slice(0, 10);
    const fileName = exportFilteredOnly
      ? `arc-users-teams-filtered-${today}.csv`
      : `arc-users-teams-all-${today}.csv`;

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-none space-y-8 animate-in fade-in duration-500">
      <div className="flex w-full flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1
            className={`text-3xl font-bold ${textColor} mb-2`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Users &amp; Teams
          </h1>

          <p className={`${mutedText} text-lg`}>
            Manage registrations, approve teams, and monitor participants.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => exportUsersAndTeams(false)}
            disabled={loading || users.length === 0}
            className={`px-4 py-2 rounded-lg font-semibold transition-all shadow-[0_2px_12px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 border ${isDark
              ? "bg-[#18181f] border-white/[0.08] text-[#F5F5F0] hover:bg-white/5"
              : "bg-white border-black/[0.08] text-[#1a1a14] hover:bg-black/5"
              } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            <Download className="w-4 h-4 text-[#588157]" />
            Export CSV
          </button>

          <button
            onClick={loadUsersAndTeams}
            disabled={loading}
            className="px-4 py-2 rounded-lg font-semibold transition-all shadow-[0_2px_12px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 bg-[#3a5a40] text-white hover:bg-[#344e41] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Users className="w-4 h-4" />
            )}
            {loading ? "Loading..." : "Refresh Data"}
          </button>
        </div>
      </div>

      <div className={`w-full max-w-none p-6 rounded-2xl border ${cardBg}`}>
        {/* Table Controls */}
        <div className="flex w-full flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center mb-6">
          <div className="relative w-full xl:flex-1">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${mutedText}`}
            />

            <input
              type="text"
              placeholder="Search by name, team, email, or segment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#588157]/40 transition-all ${inputBg}`}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            <div className="relative w-full sm:w-72">
              <Filter
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${mutedText}`}
              />

              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#588157]/40 transition-all appearance-none cursor-pointer ${inputBg}`}
              >
                <option value="All">All Segments</option>

                {segmentOptions.map((segment) => (
                  <option key={segment} value={segment}>
                    {segment}
                  </option>
                ))}
              </select>
            </div>

            <button
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border ${cardBg} ${textColor} hover:bg-white/5 transition-colors`}
            >
              <Shield className="w-4 h-4" />
              Role
            </button>

            {(searchTerm || selectedSegment !== "All") && (
              <>
                <button
                  onClick={() => exportUsersAndTeams(true)}
                  disabled={loading || filteredUsers.length === 0}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border ${cardBg} ${textColor} hover:bg-white/5 transition-colors disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  <Download className="w-4 h-4 text-[#588157]" />
                  Export Filtered
                </button>

                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedSegment("All");
                  }}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border ${cardBg} ${textColor} hover:bg-white/5 transition-colors`}
                >
                  Clear
                </button>
              </>
            )}
          </div>
        </div>

        <div className={`mb-4 text-sm ${mutedText}`}>
          Showing{" "}
          <span className={`font-semibold ${textColor}`}>
            {filteredUsers.length}
          </span>{" "}
          of{" "}
          <span className={`font-semibold ${textColor}`}>{users.length}</span>{" "}
          entries
          {selectedSegment !== "All" && (
            <>
              {" "}
              in{" "}
              <span className={`font-semibold ${textColor}`}>
                {selectedSegment}
              </span>
            </>
          )}
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto rounded-xl border border-transparent">
          <table
            className={`w-full min-w-[1000px] text-left border-collapse ${textColor}`}
          >
            <thead>
              <tr
                className={`border-b ${isDark
                  ? "border-white/10 bg-white/5"
                  : "border-gray-200 bg-gray-50"
                  } text-sm uppercase tracking-wider ${mutedText}`}
              >
                <th className="w-[28%] p-4 font-medium">Participant</th>
                <th className="w-[28%] p-4 font-medium">Team &amp; Segment</th>
                <th className="w-[16%] p-4 font-medium">Role</th>
                <th className="w-[16%] p-4 font-medium">Status</th>
                <th className="w-[12%] p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className={`p-8 text-center ${mutedText}`}>
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#588157]" />
                      Loading latest users and teams...
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`border-b ${isDark
                      ? "border-white/5 hover:bg-white/5"
                      : "border-gray-100 hover:bg-gray-50"
                      } transition-colors`}
                  >
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold">{user.name}</span>
                        <span className={`text-sm ${mutedText}`}>
                          {user.email}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{user.team}</span>
                        <span className={`text-sm ${mutedText}`}>
                          {user.segment}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.role === "Captain"
                          ? isDark
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : "bg-purple-100 text-purple-700 border-purple-200"
                          : isDark
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-blue-100 text-blue-700 border-blue-200"
                          }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${user.status === "Approved"
                          ? isDark
                            ? "bg-[#588157]/10 text-[#a3b18a] border-[#588157]/20"
                            : "bg-[#3a5a40]/10 text-[#3a5a40] border-[#3a5a40]/20"
                          : user.status === "Pending"
                            ? isDark
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-amber-100 text-amber-700 border-amber-200"
                            : isDark
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-red-100 text-red-700 border-red-200"
                          }`}
                      >
                        {user.status === "Approved" && (
                          <Check className="w-3 h-3" />
                        )}
                        {user.status === "Rejected" && (
                          <X className="w-3 h-3" />
                        )}
                        {user.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        className={`p-2 rounded-lg transition-colors ${isDark
                          ? "hover:bg-white/10 text-gray-400"
                          : "hover:bg-gray-200 text-gray-600"
                          }`}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}

              {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No users or teams found for the selected segment/search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className={`mt-6 flex w-full items-center justify-between border-t ${isDark ? "border-white/10" : "border-gray-200"
            } pt-4`}
        >
          <span className={`text-sm ${mutedText}`}>
            Showing {filteredUsers.length > 0 ? 1 : 0} to{" "}
            {filteredUsers.length} of {users.length} entries
          </span>

          <div className="flex gap-2">
            <button
              className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${isDark
                ? "border-white/10 hover:bg-white/5"
                : "border-gray-200 hover:bg-gray-50"
                }`}
              disabled
            >
              Previous
            </button>

            <button
              className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${isDark
                ? "border-white/10 hover:bg-white/5"
                : "border-gray-200 hover:bg-gray-50"
                }`}
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
