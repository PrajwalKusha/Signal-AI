"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Cloud,
    MessageSquare,
    BarChart3,
    Target,
    Kanban,
    Database,
    CheckCircle2,
    Upload,
    Plus,
    Settings,
    XCircle,
    FileText
} from "lucide-react";

interface DataSource {
    id: string;
    name: string;
    type: string;
    status: "connected" | "disconnected";
    lastSync: string;
    icon: any;
    description: string;
}

const dataSources: DataSource[] = [
    {
        id: "salesforce",
        name: "Salesforce",
        type: "CRM",
        status: "connected",
        lastSync: "2 minutes ago",
        icon: Cloud,
        description: "Customer relationship management and sales data"
    },
    {
        id: "slack",
        name: "Slack",
        type: "Communication",
        status: "connected",
        lastSync: "5 minutes ago",
        icon: MessageSquare,
        description: "Team communications and collaboration insights"
    },
    {
        id: "google-analytics",
        name: "Google Analytics",
        type: "Analytics",
        status: "connected",
        lastSync: "10 minutes ago",
        icon: BarChart3,
        description: "Website traffic and user behavior analytics"
    },
    {
        id: "hubspot",
        name: "HubSpot",
        type: "Marketing",
        status: "connected",
        lastSync: "15 minutes ago",
        icon: Target,
        description: "Marketing automation and lead tracking"
    },
    {
        id: "jira",
        name: "Jira",
        type: "Project Management",
        status: "connected",
        lastSync: "1 hour ago",
        icon: Kanban,
        description: "Project management and development tracking"
    },
    {
        id: "snowflake",
        name: "Snowflake",
        type: "Data Warehouse",
        status: "connected",
        lastSync: "30 minutes ago",
        icon: Database,
        description: "Cloud data warehouse and analytics platform"
    }
];

export default function DataSourcesPage() {
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Data Sources
                    </h1>
                    <p className="text-sm text-gray-500">
                        Connect and manage your data integrations
                    </p>
                </div>
                <button
                    onClick={() => setUploadDialogOpen(true)}
                    className="inline-flex items-center gap-2 bg-[#00897B] hover:bg-[#00796B] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-teal-900/10 transition-all hover:scale-105"
                >
                    <Plus className="w-4 h-4" />
                    Add Data Source
                </button>
            </div>

            {/* Connected Sources Grid */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#00897B]" />
                    Connected Sources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dataSources.map((source) => (
                        <DataSourceCard key={source.id} source={source} />
                    ))}
                </div>
            </div>

            {/* Upload Files Section */}
            <div className="mt-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-gray-400" />
                    Upload Files
                </h2>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border-2 border-dashed border-gray-100 rounded-xl p-8 text-center hover:border-teal-200 transition-colors cursor-pointer group"
                    onClick={() => setUploadDialogOpen(true)}
                >
                    <div className="max-w-md mx-auto">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-teal-50 transition-colors">
                            <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#00897B] transition-colors" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">
                            Drop files here or click to upload
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Supports CSV, Excel, JSON, and other data formats
                        </p>
                        <button className="inline-flex items-center gap-2 bg-white border border-gray-100 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                            <FileText className="w-4 h-4" />
                            Choose Files
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function DataSourceCard({ source }: { source: DataSource }) {
    const Icon = source.icon;
    const isConnected = source.status === "connected";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 hover:border-gray-200 group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${isConnected
                        ? "bg-teal-50 text-[#00897B]"
                        : "bg-gray-50 text-gray-400"
                        }`}>
                        <Icon strokeWidth={1.5} className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900">{source.name}</h3>
                        <p className="text-xs text-gray-500 font-medium">{source.type}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    {isConnected ? (
                        <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded text-xs font-bold text-emerald-700 border border-emerald-100/50">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Connected
                        </div>
                    ) : (
                        <span className="text-xs font-medium text-gray-500">Disconnected</span>
                    )}
                </div>
            </div>

            <p className="text-sm text-gray-600 mb-5 line-clamp-2 h-10 leading-relaxed">
                {source.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    Synced {source.lastSync}
                </span>
                <button className="text-xs font-bold text-gray-400 hover:text-[#00897B] transition-colors flex items-center gap-1 px-2 py-1.5 rounded hover:bg-teal-50">
                    <Settings className="w-3.5 h-3.5" />
                    Configure
                </button>
            </div>
        </motion.div>
    );
}
