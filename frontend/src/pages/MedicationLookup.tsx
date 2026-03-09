import React, { useState } from 'react';
import {
    Search,
    Loader2,
    Pill,
    AlertTriangle,
    Info,
    ShieldAlert,
    Activity,
    Building2,
    FileText,
    ChevronDown,
    ChevronUp,
    BarChart3,
    ArrowRight,
    Syringe,
    Baby,
    Package,
    Beaker
} from 'lucide-react';
import { Button } from '../components/common/Button';

interface MedicationData {
    brandName: string | null;
    genericName: string | null;
    manufacturer: string | null;
    productType: string | null;
    route: string | null;
    substanceName: string | null;
    indications: string | null;
    dosageAndAdministration: string | null;
    warnings: string | null;
    warningsAndCautions: string | null;
    adverseReactions: string | null;
    drugInteractions: string | null;
    contraindications: string | null;
    overdosage: string | null;
    pregnancyInfo: string | null;
    storageAndHandling: string | null;
    description: string | null;
    clinicalPharmacology: string | null;
}

interface AdverseEvent {
    reaction: string;
    count: number;
}

interface AdverseEventsData {
    drugName: string;
    adverseEvents: AdverseEvent[];
    totalReported: number;
}

export const MedicationLookup: React.FC = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [medication, setMedication] = useState<MedicationData | null>(null);
    const [adverseEvents, setAdverseEvents] = useState<AdverseEventsData | null>(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'warnings' | 'adverse'>('overview');
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['indications', 'dosage']));

    const toggleSection = (section: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(section)) next.delete(section);
            else next.add(section);
            return next;
        });
    };

    const handleSearch = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!query.trim()) {
            setError('Please enter a medication name');
            return;
        }

        setLoading(true);
        setError('');
        setMedication(null);
        setAdverseEvents(null);
        setActiveTab('overview');

        try {
            const apiKey = 'kD1peCfscdOlsUjIfz1ctReBU3QaZmwGmQIVIFRh';
            const encodedQuery = encodeURIComponent(query.trim());
            let res = await fetch(`https://api.fda.gov/drug/label.json?api_key=${apiKey}&search=(openfda.brand_name:"${encodedQuery}"+openfda.generic_name:"${encodedQuery}")&limit=1`);

            if (!res.ok) {
                // fallback to general search
                res = await fetch(`https://api.fda.gov/drug/label.json?api_key=${apiKey}&search="${encodedQuery}"&limit=1`);
            }

            if (!res.ok) {
                throw new Error('Medication not found in FDA database');
            }

            const data = await res.json();
            const result = data.results[0];
            const openfda = result.openfda || {};

            setMedication({
                brandName: openfda.brand_name?.[0] || query,
                genericName: openfda.generic_name?.[0] || null,
                manufacturer: openfda.manufacturer_name?.[0] || null,
                productType: openfda.product_type?.[0] || null,
                route: openfda.route?.[0] || null,
                substanceName: openfda.substance_name?.[0] || null,
                indications: result.indications_and_usage?.[0] || null,
                dosageAndAdministration: result.dosage_and_administration?.[0] || null,
                warnings: result.warnings?.[0] || null,
                warningsAndCautions: result.warnings_and_cautions?.[0] || null,
                adverseReactions: result.adverse_reactions?.[0] || null,
                drugInteractions: result.drug_interactions?.[0] || null,
                contraindications: result.contraindications?.[0] || null,
                overdosage: result.overdosage?.[0] || null,
                pregnancyInfo: result.pregnancy?.[0] || result.pregnancy_or_breast_feeding?.[0] || null,
                storageAndHandling: result.storage_and_handling?.[0] || null,
                description: result.description?.[0] || null,
                clinicalPharmacology: result.clinical_pharmacology?.[0] || null
            });

            fetchAdverseEvents(query.trim());
        } catch (err: any) {
            setError(err.message || 'Failed to search medication.');
        } finally {
            setLoading(false);
        }
    };

    const fetchAdverseEvents = async (drugName: string) => {
        setLoadingEvents(true);
        try {
            const apiKey = 'kD1peCfscdOlsUjIfz1ctReBU3QaZmwGmQIVIFRh';
            const encodedQuery = encodeURIComponent(drugName.toLowerCase());
            const eventUrl = `https://api.fda.gov/drug/event.json?api_key=${apiKey}&search=patient.drug.medicinalproduct:"${encodedQuery}"&count=patient.reaction.reactionmeddrapt.exact`;

            const res = await fetch(eventUrl);
            if (!res.ok) throw new Error('No adverse events found');

            const data = await res.json();
            const results = data.results || [];

            let totalReported = 0;
            const mappedEvents = results.slice(0, 15).map((item: any) => {
                totalReported += item.count;
                return {
                    reaction: item.term,
                    count: item.count
                };
            });

            for (let i = 15; i < results.length; i++) {
                totalReported += results[i].count;
            }

            setAdverseEvents({
                drugName,
                totalReported,
                adverseEvents: mappedEvents
            });
        } catch {
            // Silently fail — adverse events are supplementary
        } finally {
            setLoadingEvents(false);
        }
    };

    const truncateText = (text: string, maxLen = 300) => {
        if (text.length <= maxLen) return text;
        return text.substring(0, maxLen).trimEnd() + '…';
    };

    const popularDrugs = ['Ibuprofen', 'Amoxicillin', 'Metformin', 'Lisinopril', 'Omeprazole', 'Atorvastatin'];

    return (
        <div className="flex flex-col min-h-screen bg-[var(--surface-background)]">
            {/* Hero */}
            <section className="pt-20 pb-12 px-4 text-center bg-[var(--surface-white)] border-b border-[var(--border-light)]">
                <div className="container max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-50)] text-[var(--primary-700)] text-sm font-medium mb-6 border border-[var(--primary-100)]">
                        <Pill size={16} />
                        <span>FDA Drug Database</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-[var(--secondary-900)] mb-4 tracking-tight">
                        Look up any medication, <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-600)] to-blue-500">powered by openFDA</span>
                    </h1>
                    <p className="text-lg text-[var(--secondary-500)] max-w-2xl mx-auto mb-8">
                        Search the FDA's official drug database for detailed labeling, warnings, interactions, and reported adverse events.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                        <div className="relative flex items-center">
                            <div className="absolute left-4 text-[var(--secondary-400)]">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Enter drug name (e.g. Ibuprofen, Aspirin, Metformin)..."
                                className="w-full pl-12 pr-36 py-4 text-lg rounded-2xl border-2 border-[var(--border-medium)] bg-[var(--surface-card)] text-[var(--secondary-900)] placeholder:text-[var(--secondary-400)] focus:outline-none focus:border-[var(--primary-500)] focus:ring-4 focus:ring-[var(--primary-100)] transition-all"
                            />
                            <div className="absolute right-2">
                                <Button type="submit" size="md" icon={Search} disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Searching
                                        </>
                                    ) : (
                                        'Search'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>

                    {/* Quick Search Pills */}
                    {!medication && (
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                            <span className="text-sm text-[var(--secondary-400)]">Try:</span>
                            {popularDrugs.map((drug) => (
                                <button
                                    key={drug}
                                    onClick={() => { setQuery(drug); }}
                                    className="px-3 py-1.5 text-sm font-medium rounded-full bg-[var(--surface-background)] border border-[var(--border-light)] text-[var(--secondary-600)] hover:border-[var(--primary-300)] hover:text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-all"
                                >
                                    {drug}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Content */}
            <section className="py-10 px-4 flex-1">
                <div className="container max-w-5xl mx-auto">
                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 mb-6">
                            <AlertTriangle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-20 h-20 rounded-full border-4 border-[var(--primary-100)] flex items-center justify-center">
                                <Loader2 size={36} className="animate-spin text-[var(--primary-600)]" />
                            </div>
                            <h3 className="text-lg font-bold text-[var(--secondary-900)]">Searching FDA database...</h3>
                            <p className="text-[var(--secondary-500)] text-sm">Fetching official drug labeling data</p>
                        </div>
                    )}

                    {/* Results */}
                    {medication && !loading && (
                        <div className="space-y-6">
                            {/* Drug Header Card */}
                            <div className="bg-[var(--surface-card)] border border-[var(--border-light)] rounded-2xl p-6 shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-[var(--secondary-900)]">
                                            {medication.brandName || medication.genericName || query}
                                        </h2>
                                        <div className="flex flex-wrap items-center gap-3 mt-2">
                                            {medication.genericName && medication.genericName !== medication.brandName && (
                                                <span className="text-sm text-[var(--secondary-500)]">
                                                    Generic: <span className="font-medium text-[var(--secondary-700)]">{medication.genericName}</span>
                                                </span>
                                            )}
                                            {medication.manufacturer && (
                                                <span className="flex items-center gap-1 text-sm text-[var(--secondary-500)]">
                                                    <Building2 size={13} />
                                                    {medication.manufacturer}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {medication.productType && (
                                            <span className="px-3 py-1 rounded-full bg-[var(--primary-50)] text-[var(--primary-700)] text-xs font-bold uppercase tracking-wide border border-[var(--primary-100)]">
                                                {medication.productType}
                                            </span>
                                        )}
                                        {medication.route && (
                                            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide border border-blue-100">
                                                {medication.route}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {medication.description && (
                                    <p className="mt-4 text-sm text-[var(--secondary-600)] leading-relaxed border-t border-[var(--border-light)] pt-4">
                                        {truncateText(medication.description, 400)}
                                    </p>
                                )}
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-[var(--border-light)]">
                                {([
                                    { key: 'overview', label: 'Overview', icon: FileText },
                                    { key: 'warnings', label: 'Warnings & Interactions', icon: ShieldAlert },
                                    { key: 'adverse', label: 'Adverse Events', icon: Activity },
                                ] as const).map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === tab.key
                                            ? 'border-[var(--primary-600)] text-[var(--primary-700)]'
                                            : 'border-transparent text-[var(--secondary-500)] hover:text-[var(--secondary-700)] hover:border-[var(--secondary-200)]'
                                            }`}
                                    >
                                        <tab.icon size={16} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            {activeTab === 'overview' && (
                                <div className="space-y-4">
                                    {/* Indications */}
                                    {medication.indications && (
                                        <CollapsibleSection
                                            title="Indications & Usage"
                                            icon={<Syringe size={18} className="text-[var(--primary-600)]" />}
                                            content={medication.indications}
                                            isOpen={expandedSections.has('indications')}
                                            onToggle={() => toggleSection('indications')}
                                            accent="primary"
                                        />
                                    )}

                                    {/* Dosage */}
                                    {medication.dosageAndAdministration && (
                                        <CollapsibleSection
                                            title="Dosage & Administration"
                                            icon={<Pill size={18} className="text-blue-600" />}
                                            content={medication.dosageAndAdministration}
                                            isOpen={expandedSections.has('dosage')}
                                            onToggle={() => toggleSection('dosage')}
                                            accent="blue"
                                        />
                                    )}

                                    {/* Clinical Pharmacology */}
                                    {medication.clinicalPharmacology && (
                                        <CollapsibleSection
                                            title="Clinical Pharmacology"
                                            icon={<Beaker size={18} className="text-purple-600" />}
                                            content={medication.clinicalPharmacology}
                                            isOpen={expandedSections.has('pharmacology')}
                                            onToggle={() => toggleSection('pharmacology')}
                                            accent="purple"
                                        />
                                    )}

                                    {/* Pregnancy Info */}
                                    {medication.pregnancyInfo && (
                                        <CollapsibleSection
                                            title="Pregnancy & Breastfeeding"
                                            icon={<Baby size={18} className="text-pink-600" />}
                                            content={medication.pregnancyInfo}
                                            isOpen={expandedSections.has('pregnancy')}
                                            onToggle={() => toggleSection('pregnancy')}
                                            accent="pink"
                                        />
                                    )}

                                    {/* Storage */}
                                    {medication.storageAndHandling && (
                                        <CollapsibleSection
                                            title="Storage & Handling"
                                            icon={<Package size={18} className="text-gray-600" />}
                                            content={medication.storageAndHandling}
                                            isOpen={expandedSections.has('storage')}
                                            onToggle={() => toggleSection('storage')}
                                            accent="gray"
                                        />
                                    )}
                                </div>
                            )}

                            {activeTab === 'warnings' && (
                                <div className="space-y-4">
                                    {/* Warnings */}
                                    {(medication.warnings || medication.warningsAndCautions) && (
                                        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <AlertTriangle size={20} className="text-red-600" />
                                                <h3 className="text-lg font-bold text-red-800">Warnings</h3>
                                            </div>
                                            <p className="text-sm text-red-700 leading-relaxed whitespace-pre-line">
                                                {medication.warnings || medication.warningsAndCautions}
                                            </p>
                                        </div>
                                    )}

                                    {/* Contraindications */}
                                    {medication.contraindications && (
                                        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <ShieldAlert size={20} className="text-orange-600" />
                                                <h3 className="text-lg font-bold text-orange-800">Contraindications</h3>
                                            </div>
                                            <p className="text-sm text-orange-700 leading-relaxed whitespace-pre-line">
                                                {medication.contraindications}
                                            </p>
                                        </div>
                                    )}

                                    {/* Drug Interactions */}
                                    {medication.drugInteractions && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Activity size={20} className="text-amber-600" />
                                                <h3 className="text-lg font-bold text-amber-800">Drug Interactions</h3>
                                            </div>
                                            <p className="text-sm text-amber-700 leading-relaxed whitespace-pre-line">
                                                {medication.drugInteractions}
                                            </p>
                                        </div>
                                    )}

                                    {/* Overdosage */}
                                    {medication.overdosage && (
                                        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <AlertTriangle size={20} className="text-purple-600" />
                                                <h3 className="text-lg font-bold text-purple-800">Overdosage</h3>
                                            </div>
                                            <p className="text-sm text-purple-700 leading-relaxed whitespace-pre-line">
                                                {medication.overdosage}
                                            </p>
                                        </div>
                                    )}

                                    {/* Adverse Reactions from Label */}
                                    {medication.adverseReactions && (
                                        <div className="bg-[var(--surface-card)] border border-[var(--border-light)] rounded-2xl p-5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Info size={20} className="text-[var(--secondary-600)]" />
                                                <h3 className="text-lg font-bold text-[var(--secondary-800)]">Adverse Reactions (Label)</h3>
                                            </div>
                                            <p className="text-sm text-[var(--secondary-600)] leading-relaxed whitespace-pre-line">
                                                {medication.adverseReactions}
                                            </p>
                                        </div>
                                    )}

                                    {!medication.warnings && !medication.warningsAndCautions && !medication.contraindications && !medication.drugInteractions && (
                                        <div className="flex flex-col items-center justify-center py-12 text-[var(--secondary-400)]">
                                            <ShieldAlert size={48} className="mb-3 opacity-30" />
                                            <p className="text-lg font-medium">No warning data available</p>
                                            <p className="text-sm">FDA label data did not include warnings for this medication</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'adverse' && (
                                <div className="space-y-4">
                                    {loadingEvents ? (
                                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                                            <Loader2 size={32} className="animate-spin text-[var(--primary-600)]" />
                                            <p className="text-[var(--secondary-500)]">Loading adverse event reports...</p>
                                        </div>
                                    ) : adverseEvents && adverseEvents.adverseEvents.length > 0 ? (
                                        <>
                                            <div className="bg-[var(--surface-card)] border border-[var(--border-light)] rounded-2xl p-5">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <BarChart3 size={20} className="text-[var(--primary-600)]" />
                                                        <h3 className="text-lg font-bold text-[var(--secondary-900)]">
                                                            Top Reported Adverse Events
                                                        </h3>
                                                    </div>
                                                    <span className="text-sm text-[var(--secondary-500)]">
                                                        {adverseEvents.totalReported.toLocaleString()} total reports
                                                    </span>
                                                </div>
                                                <p className="text-xs text-[var(--secondary-400)] mb-5">
                                                    Based on FDA Adverse Event Reporting System (FAERS) data. Counts represent individual reports, not unique patients.
                                                </p>

                                                <div className="space-y-3">
                                                    {adverseEvents.adverseEvents.map((event, i) => {
                                                        const maxCount = adverseEvents.adverseEvents[0].count;
                                                        const percentage = (event.count / maxCount) * 100;

                                                        return (
                                                            <div key={i} className="group">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-sm font-medium text-[var(--secondary-800)] capitalize">
                                                                        {event.reaction.toLowerCase()}
                                                                    </span>
                                                                    <span className="text-sm font-bold text-[var(--secondary-600)]">
                                                                        {event.count.toLocaleString()}
                                                                    </span>
                                                                </div>
                                                                <div className="h-2.5 bg-[var(--secondary-100)] rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full rounded-full transition-all duration-700 ease-out"
                                                                        style={{
                                                                            width: `${percentage}%`,
                                                                            background: i < 3
                                                                                ? 'linear-gradient(90deg, #ef4444, #f97316)'
                                                                                : i < 7
                                                                                    ? 'linear-gradient(90deg, #f59e0b, #eab308)'
                                                                                    : 'linear-gradient(90deg, var(--primary-400), var(--primary-500))'
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-sm">
                                                <Info size={18} className="flex-shrink-0 mt-0.5" />
                                                <p>
                                                    These reports are voluntarily submitted to the FDA and may not establish a causal relationship between the drug and the reported reaction.
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-[var(--secondary-400)]">
                                            <Activity size={48} className="mb-3 opacity-30" />
                                            <p className="text-lg font-medium">No adverse event data found</p>
                                            <p className="text-sm">The FAERS database has no reported events for this medication</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* FDA Disclaimer */}
                            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                                <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                                <p>
                                    Data sourced from the openFDA Drug Label and Adverse Event APIs. This information is for educational purposes only and should not replace professional medical advice. Always consult your healthcare provider.
                                </p>
                            </div>

                            {/* Search Again */}
                            <div className="flex justify-center">
                                <Button
                                    variant="secondary"
                                    icon={ArrowRight}
                                    onClick={() => { setMedication(null); setAdverseEvents(null); setQuery(''); }}
                                >
                                    Search Another Medication
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};


// --- Collapsible Section Sub-component ---
interface CollapsibleSectionProps {
    title: string;
    icon: React.ReactNode;
    content: string;
    isOpen: boolean;
    onToggle: () => void;
    accent: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, icon, content, isOpen, onToggle, accent }) => {
    const bgMap: Record<string, string> = {
        primary: 'bg-[var(--primary-50)] border-[var(--primary-100)]',
        blue: 'bg-blue-50 border-blue-100',
        purple: 'bg-purple-50 border-purple-100',
        pink: 'bg-pink-50 border-pink-100',
        gray: 'bg-gray-50 border-gray-200',
    };

    return (
        <div className={`rounded-2xl border overflow-hidden transition-all ${bgMap[accent] || bgMap.primary}`}>
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-5 text-left hover:opacity-80 transition-opacity"
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <h3 className="text-base font-bold text-[var(--secondary-900)]">{title}</h3>
                </div>
                {isOpen ? <ChevronUp size={18} className="text-[var(--secondary-400)]" /> : <ChevronDown size={18} className="text-[var(--secondary-400)]" />}
            </button>
            {isOpen && (
                <div className="px-5 pb-5">
                    <p className="text-sm text-[var(--secondary-700)] leading-relaxed whitespace-pre-line">
                        {content}
                    </p>
                </div>
            )}
        </div>
    );
};
