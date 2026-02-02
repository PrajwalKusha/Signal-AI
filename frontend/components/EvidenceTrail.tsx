import { Database, FileText, Code2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface EvidenceTrailProps {
    signal: any;
}

export function EvidenceTrail({ signal }: EvidenceTrailProps) {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        csv: true,
        txt: true,
        json: true
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Extract evidence from signal data structure
    const csvEvidence = signal.evidence_csv || signal.anomaly?.evidence_csv;
    const txtEvidence = signal.evidence_txt || signal.context_insight?.evidence_txt;
    const jsonEvidence = signal.evidence_json || signal.recommendation?.evidence_json;

    // If no evidence exists, don't render the component
    if (!csvEvidence && !txtEvidence && !jsonEvidence) {
        return null;
    }

    return (
        <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <Database size={20} className="text-teal-600" />
                <h2 className="text-lg font-bold text-gray-900">Evidence Trail</h2>
                <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Data Provenance
                </span>
            </div>

            <div className="space-y-4">
                {/* CSV Evidence */}
                {csvEvidence && (
                    <div className="border border-blue-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleSection('csv')}
                            className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <FileText size={18} className="text-blue-600" />
                                <div className="text-left">
                                    <div className="font-bold text-gray-900 text-sm">1. Anomaly Detection</div>
                                    <div className="text-xs text-gray-600 font-mono">{csvEvidence.file}</div>
                                </div>
                            </div>
                            {expandedSections.csv ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>

                        {expandedSections.csv && (
                            <div className="p-4 bg-white">
                                <p className="text-sm text-gray-700 mb-3">{csvEvidence.summary}</p>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100 border-b border-gray-300">
                                                <th className="px-3 py-2 text-left font-bold text-gray-700">Row #</th>
                                                <th className="px-3 py-2 text-left font-bold text-gray-700">Date</th>
                                                <th className="px-3 py-2 text-left font-bold text-gray-700">Region</th>
                                                <th className="px-3 py-2 text-right font-bold text-gray-700">Deal Size</th>
                                                {csvEvidence.rows[0]?.Product_Tier && (
                                                    <th className="px-3 py-2 text-left font-bold text-gray-700">Tier</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {csvEvidence.rows.map((row: any, idx: number) => (
                                                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                                                    <td className="px-3 py-2 font-mono text-gray-500">#{row.row_number}</td>
                                                    <td className="px-3 py-2 font-mono">{row.Date}</td>
                                                    <td className="px-3 py-2">{row.Region}</td>
                                                    <td className="px-3 py-2 text-right font-mono">
                                                        ${typeof row.Deal_Size_USD === 'number'
                                                            ? row.Deal_Size_USD.toLocaleString()
                                                            : row.Deal_Size_USD}
                                                    </td>
                                                    {row.Product_Tier && (
                                                        <td className="px-3 py-2">
                                                            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                                                                {row.Product_Tier}
                                                            </span>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* TXT Evidence */}
                {txtEvidence && (
                    <div className="border border-purple-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleSection('txt')}
                            className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <FileText size={18} className="text-purple-600" />
                                <div className="text-left">
                                    <div className="font-bold text-gray-900 text-sm">2. Internal Context</div>
                                    <div className="text-xs text-gray-600 font-mono">{txtEvidence.file}</div>
                                </div>
                            </div>
                            {expandedSections.txt ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>

                        {expandedSections.txt && (
                            <div className="p-4 bg-white">
                                <p className="text-sm text-gray-700 mb-3 italic">{txtEvidence.context}</p>
                                <div className="bg-gray-50 border-l-4 border-purple-400 p-4 rounded">
                                    <p className="text-sm text-gray-800 font-mono leading-relaxed whitespace-pre-wrap">
                                        "{txtEvidence.excerpt}"
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* JSON Evidence */}
                {jsonEvidence && (
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleSection('json')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Code2 size={18} className="text-gray-600" />
                                <div className="text-left">
                                    <div className="font-bold text-gray-900 text-sm">3. Proposed Solution</div>
                                    <div className="text-xs text-gray-600 font-mono">{jsonEvidence.file}</div>
                                </div>
                            </div>
                            {expandedSections.json ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>

                        {expandedSections.json && (
                            <div className="p-4 bg-white">
                                <p className="text-sm text-gray-700 mb-3">{jsonEvidence.context}</p>
                                <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                                    <pre className="text-xs text-green-400 font-mono">
                                        {JSON.stringify(jsonEvidence.entry, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
