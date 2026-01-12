import { useState, useRef, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    ArrowLeft,
    Upload,
    FileText,
    AlertCircle,
    X,
    Search,
    Info,
    Building2,
    Receipt,
    FileCheck,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
} from "lucide-react";

function BusinessSearchDropdown({
    businesses,
    selectedBusinessId,
    onSelect,
    error,
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedBusiness = businesses.find(
        (b) => b.id === parseInt(selectedBusinessId)
    );

    const filteredBusinesses = businesses.filter(
        (business) =>
            business.business_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            business.owner_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getLabReportStatusBadge = (business) => {
        const status = business.latest_lab_report_status;
        const result = business.latest_lab_report_result;

        if (!status) {
            return (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-700 inline-flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    No Lab Report
                </span>
            );
        }

        if (status === "pending") {
            return (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700 inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Pending Review
                </span>
            );
        }

        if (status === "approved") {
            return (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700 inline-flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Approved{" "}
                    {result === "pass"
                        ? "(Pass)"
                        : result === "fail"
                        ? "(Fail)"
                        : ""}
                </span>
            );
        }

        if (status === "rejected") {
            return (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700 inline-flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Rejected
                </span>
            );
        }

        return null;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Business <span className="text-red-500">*</span>
            </label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-2.5 border rounded-lg cursor-pointer bg-white transition-all ${
                    error
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 hover:border-gray-400"
                } ${isOpen ? "ring-2 ring-blue-500 border-blue-500" : ""}`}
            >
                {selectedBusiness ? (
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <span className="font-medium text-gray-900">
                                {selectedBusiness.business_name}
                            </span>
                            <span className="text-gray-500 text-sm ml-2">
                                - {selectedBusiness.owner_name}
                            </span>
                            <div className="mt-1">
                                {getLabReportStatusBadge(selectedBusiness)}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect("");
                                setSearchTerm("");
                            }}
                            className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                        >
                            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </button>
                    </div>
                ) : (
                    <span className="text-gray-400">
                        Search and select a business...
                    </span>
                )}
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
                    <div className="p-3 border-b border-gray-200 bg-gray-50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by business or owner name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                        {filteredBusinesses.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                No businesses found
                            </div>
                        ) : (
                            filteredBusinesses.map((business) => (
                                <div
                                    key={business.id}
                                    onClick={() => {
                                        onSelect(business.id.toString());
                                        setIsOpen(false);
                                        setSearchTerm("");
                                    }}
                                    className={`p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                                        selectedBusinessId ===
                                        business.id.toString()
                                            ? "bg-blue-50"
                                            : ""
                                    }`}
                                >
                                    <div className="font-medium text-gray-900">
                                        {business.business_name}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-0.5">
                                        Owner: {business.owner_name}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-500">
                                            Lab Report:
                                        </span>
                                        {getLabReportStatusBadge(business)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {error && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </p>
            )}
        </div>
    );
}

function FileUploadBox({ field, preview, onFileChange, error, label }) {
    const fileInputRef = useRef(null);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} <span className="text-red-500">*</span>
            </label>
            <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                    error
                        ? "border-red-300 bg-red-50 hover:border-red-400"
                        : preview
                        ? "border-blue-300 bg-blue-50 hover:border-blue-400"
                        : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                }`}
            >
                {preview ? (
                    <div className="space-y-3">
                        <img
                            src={preview}
                            alt="Preview"
                            className="mx-auto h-40 w-auto rounded-lg shadow-sm object-cover"
                        />
                        <div className="flex items-center justify-center gap-2 text-sm text-blue-600 font-medium">
                            <FileText className="w-4 h-4" />
                            File uploaded - Click to change
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                Click to upload document
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG up to 5MB
                            </p>
                        </div>
                    </div>
                )}
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => onFileChange(e, field)}
                className="hidden"
            />
            {error && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </p>
            )}
        </div>
    );
}

function DocumentUploadSection({
    title,
    icon: Icon,
    field,
    data,
    setData,
    preview,
    onFileChange,
    errors,
}) {
    const photoField = `${field}_photo`;
    const remarksField = `${field}_remarks`;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Icon className="w-5 h-5 mr-2 text-blue-600" />
                {title}
            </h2>

            <div className="space-y-5">
                <FileUploadBox
                    field={photoField}
                    preview={preview}
                    onFileChange={onFileChange}
                    error={errors[photoField]}
                    label="Upload Document Photo"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes (Optional)
                    </label>
                    <textarea
                        value={data[remarksField] || ""}
                        onChange={(e) => setData(remarksField, e.target.value)}
                        rows="3"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Add any notes about this document..."
                    />
                    {errors[remarksField] && (
                        <p className="mt-1.5 text-sm text-red-600">
                            {errors[remarksField]}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Create({
    auth,
    businesses,
    selectedBusinessId,
    selectedBusiness: preSelectedBusiness,
}) {
    const { data, setData, post, processing, errors } = useForm({
        business_id: selectedBusinessId || "",
        application_type: "",
        fecalysis_photo: null,
        xray_sputum_photo: null,
        receipt_photo: null,
        dti_photo: null,
        fecalysis_remarks: "",
        xray_sputum_remarks: "",
        receipt_remarks: "",
        dti_remarks: "",
        general_remarks: "",
    });

    const [previews, setPreviews] = useState({
        fecalysis_photo: null,
        xray_sputum_photo: null,
        receipt_photo: null,
        dti_photo: null,
    });

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("File size must be less than 5MB");
                return;
            }

            setData(field, file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews((prev) => ({
                    ...prev,
                    [field]: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Submitting lab report with data:", {
            business_id: data.business_id,
            application_type: data.application_type,
            has_fecalysis: !!data.fecalysis_photo,
            has_xray: !!data.xray_sputum_photo,
            has_receipt: !!data.receipt_photo,
            has_dti: !!data.dti_photo,
        });

        post(route("lab-reports.store"), {
            forceFormData: true,
            onError: (errors) => {
                console.error("Lab report submission errors:", errors);
            },
            onSuccess: () => {
                console.log("Lab report submitted successfully");
            },
        });
    };

    const selectedBusiness = businesses.find(
        (b) => b.id === parseInt(data.business_id)
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Submit Lab Report" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={route("lab-reports.index")}
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 font-medium transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Lab Reports
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Submit Lab Report
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Upload laboratory examination documents for sanitary
                            permit processing
                        </p>
                    </div>

                    {/* Process Info Banner */}
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-2">
                                    Submission Process
                                </p>
                                <ol className="list-decimal list-inside space-y-1">
                                    <li>Upload all required documents</li>
                                    <li>
                                        Documents will be reviewed and evaluated
                                        by a sanitary inspector
                                    </li>
                                    <li>
                                        For <strong>new applications</strong>: A
                                        physical inspection will be scheduled 3
                                        days from submission
                                    </li>
                                    <li>
                                        For <strong>renewals</strong>: Physical
                                        inspection is not required
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Business Information */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                                Business Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <BusinessSearchDropdown
                                        businesses={businesses}
                                        selectedBusinessId={data.business_id}
                                        onSelect={(businessId) =>
                                            setData("business_id", businessId)
                                        }
                                        error={errors.business_id}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Application Type{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.application_type}
                                        onChange={(e) =>
                                            setData(
                                                "application_type",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select type...</option>
                                        <option value="new">
                                            New Application
                                        </option>
                                        <option value="renewal">Renewal</option>
                                    </select>
                                    {errors.application_type && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {errors.application_type}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {selectedBusiness && (
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                        <div>
                                            <span className="font-medium text-blue-900">
                                                Business:
                                            </span>
                                            <p className="text-blue-800">
                                                {selectedBusiness.business_name}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-blue-900">
                                                Owner:
                                            </span>
                                            <p className="text-blue-800">
                                                {selectedBusiness.owner_name}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-blue-900">
                                                Permit Status:
                                            </span>
                                            <p className="text-blue-800">
                                                {selectedBusiness.permit_status
                                                    .replace("_", " ")
                                                    .toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data.application_type && (
                                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-amber-800">
                                            <span className="font-medium">
                                                {data.application_type === "new"
                                                    ? "Physical Inspection Required:"
                                                    : "No Physical Inspection:"}
                                            </span>{" "}
                                            {data.application_type === "new"
                                                ? "A physical inspection will be automatically scheduled 3 days from submission."
                                                : "Renewal applications only require document review by the inspector."}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Document Upload Sections */}
                        <DocumentUploadSection
                            title="Fecalysis Examination"
                            icon={FileText}
                            field="fecalysis"
                            data={data}
                            setData={setData}
                            preview={previews.fecalysis_photo}
                            onFileChange={handleFileChange}
                            errors={errors}
                        />

                        <DocumentUploadSection
                            title="X-Ray Examination"
                            icon={FileText}
                            field="xray_sputum"
                            data={data}
                            setData={setData}
                            preview={previews.xray_sputum_photo}
                            onFileChange={handleFileChange}
                            errors={errors}
                        />

                        <DocumentUploadSection
                            title="Sputum Examination"
                            icon={Receipt}
                            field="receipt"
                            data={data}
                            setData={setData}
                            preview={previews.receipt_photo}
                            onFileChange={handleFileChange}
                            errors={errors}
                        />

                        <DocumentUploadSection
                            title="DTI Business Registration"
                            icon={FileCheck}
                            field="dti"
                            data={data}
                            setData={setData}
                            preview={previews.dti_photo}
                            onFileChange={handleFileChange}
                            errors={errors}
                        />

                        {/* General Remarks */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Additional Information
                            </h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    General Remarks (Optional)
                                </label>
                                <textarea
                                    value={data.general_remarks}
                                    onChange={(e) =>
                                        setData(
                                            "general_remarks",
                                            e.target.value
                                        )
                                    }
                                    rows="4"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Add any additional information or comments about this submission..."
                                />
                                {errors.general_remarks && (
                                    <p className="mt-1.5 text-sm text-red-600">
                                        {errors.general_remarks}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end gap-4 pt-4">
                            <Link
                                href={route("lab-reports.index")}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                            >
                                {processing
                                    ? "Submitting..."
                                    : "Submit Lab Report"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
