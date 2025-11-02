import { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    ArrowLeft,
    Upload,
    FileText,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";

export default function Edit({ auth, labReport, businesses }) {
    const { data, setData, post, processing, errors } = useForm({
        business_id: labReport.business_id,
        application_type: labReport.application_type,
        fecalysis_photo: null,
        xray_sputum_photo: null,
        receipt_photo: null,
        dti_photo: null,
        fecalysis_result: labReport.fecalysis_result,
        xray_sputum_result: labReport.xray_sputum_result,
        receipt_result: labReport.receipt_result,
        dti_result: labReport.dti_result,
        fecalysis_remarks: labReport.fecalysis_remarks || "",
        xray_sputum_remarks: labReport.xray_sputum_remarks || "",
        receipt_remarks: labReport.receipt_remarks || "",
        dti_remarks: labReport.dti_remarks || "",
        general_remarks: labReport.general_remarks || "",
        _method: "PUT",
    });

    const [previews, setPreviews] = useState({
        fecalysis_photo: labReport.fecalysis_photo_url,
        xray_sputum_photo: labReport.xray_sputum_photo_url,
        receipt_photo: labReport.receipt_photo_url,
        dti_photo: labReport.dti_photo_url,
    });

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
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
        post(route("lab-reports.update", labReport.id));
    };

    const selectedBusiness = businesses.find(
        (b) => b.id === parseInt(data.business_id)
    );

    const getResultIcon = (result) => {
        return result === "pass" ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
            <XCircle className="w-5 h-5 text-red-600" />
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Lab Report" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={route("lab-reports.index")}
                            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Lab Reports
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Edit Lab Report
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Update laboratory examination results
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Business Information */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Business Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Business{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.business_id}
                                        onChange={(e) =>
                                            setData(
                                                "business_id",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 cursor-not-allowed"
                                        required
                                        disabled
                                    >
                                        <option value="">
                                            Choose a business...
                                        </option>
                                        {businesses.map((business) => (
                                            <option
                                                key={business.id}
                                                value={business.id}
                                            >
                                                {business.business_name} -{" "}
                                                {business.owner_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.business_id && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.business_id}
                                        </p>
                                    )}
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 cursor-not-allowed"
                                        required
                                        disabled
                                    >
                                        <option value="">Select type...</option>
                                        <option value="new">
                                            New Application
                                        </option>
                                        <option value="renewal">Renewal</option>
                                    </select>
                                    {errors.application_type && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.application_type}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Fecalysis Examination */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2" />
                                Fecalysis Examination
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Photo (Leave empty to keep
                                        current)
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex-1 cursor-pointer">
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                                {previews.fecalysis_photo ? (
                                                    <div>
                                                        <img
                                                            src={
                                                                previews.fecalysis_photo
                                                            }
                                                            alt="Preview"
                                                            className="mx-auto h-32 w-auto rounded"
                                                        />
                                                        <p className="mt-2 text-sm text-gray-600">
                                                            Click to change
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                        <p className="mt-2 text-sm text-gray-600">
                                                            Click to upload
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            PNG, JPG up to 5MB
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleFileChange(
                                                        e,
                                                        "fecalysis_photo"
                                                    )
                                                }
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    {errors.fecalysis_photo && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.fecalysis_photo}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Result{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="pass"
                                                checked={
                                                    data.fecalysis_result ===
                                                    "pass"
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "fecalysis_result",
                                                        e.target.value
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            <CheckCircle className="w-5 h-5 text-green-600 mr-1" />
                                            <span className="text-sm font-medium text-gray-700">
                                                Pass
                                            </span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="fail"
                                                checked={
                                                    data.fecalysis_result ===
                                                    "fail"
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "fecalysis_result",
                                                        e.target.value
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            <XCircle className="w-5 h-5 text-red-600 mr-1" />
                                            <span className="text-sm font-medium text-gray-700">
                                                Fail
                                            </span>
                                        </label>
                                    </div>
                                    {errors.fecalysis_result && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.fecalysis_result}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Remarks
                                    </label>
                                    <textarea
                                        value={data.fecalysis_remarks}
                                        onChange={(e) =>
                                            setData(
                                                "fecalysis_remarks",
                                                e.target.value
                                            )
                                        }
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Add any specific remarks or observations..."
                                    />
                                    {errors.fecalysis_remarks && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.fecalysis_remarks}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* X-ray/Sputum Examination */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2" />
                                X-ray/Sputum Examination
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Photo (Leave empty to keep
                                        current)
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex-1 cursor-pointer">
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                                {previews.xray_sputum_photo ? (
                                                    <div>
                                                        <img
                                                            src={
                                                                previews.xray_sputum_photo
                                                            }
                                                            alt="Preview"
                                                            className="mx-auto h-32 w-auto rounded"
                                                        />
                                                        <p className="mt-2 text-sm text-gray-600">
                                                            Click to change
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                        <p className="mt-2 text-sm text-gray-600">
                                                            Click to upload
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            PNG, JPG up to 5MB
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleFileChange(
                                                        e,
                                                        "xray_sputum_photo"
                                                    )
                                                }
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    {errors.xray_sputum_photo && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.xray_sputum_photo}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Result{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="pass"
                                                checked={
                                                    data.xray_sputum_result ===
                                                    "pass"
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "xray_sputum_result",
                                                        e.target.value
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            <CheckCircle className="w-5 h-5 text-green-600 mr-1" />
                                            <span className="text-sm font-medium text-gray-700">
                                                Pass
                                            </span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="fail"
                                                checked={
                                                    data.xray_sputum_result ===
                                                    "fail"
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "xray_sputum_result",
                                                        e.target.value
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            <XCircle className="w-5 h-5 text-red-600 mr-1" />
                                            <span className="text-sm font-medium text-gray-700">
                                                Fail
                                            </span>
                                        </label>
                                    </div>
                                    {errors.xray_sputum_result && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.xray_sputum_result}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Remarks
                                    </label>
                                    <textarea
                                        value={data.xray_sputum_remarks}
                                        onChange={(e) =>
                                            setData(
                                                "xray_sputum_remarks",
                                                e.target.value
                                            )
                                        }
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Add any specific remarks or observations..."
                                    />
                                    {errors.xray_sputum_remarks && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.xray_sputum_remarks}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Receipt */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2" />
                                Receipt
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Photo (Leave empty to keep
                                        current)
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex-1 cursor-pointer">
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                                {previews.receipt_photo ? (
                                                    <div>
                                                        <img
                                                            src={
                                                                previews.receipt_photo
                                                            }
                                                            alt="Preview"
                                                            className="mx-auto h-32 w-auto rounded"
                                                        />
                                                        <p className="mt-2 text-sm text-gray-600">
                                                            Click to change
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                        <p className="mt-2 text-sm text-gray-600">
                                                            Click to upload
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            PNG, JPG up to 5MB
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleFileChange(
                                                        e,
                                                        "receipt_photo"
                                                    )
                                                }
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    {errors.receipt_photo && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.receipt_photo}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Result{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="pass"
                                                checked={
                                                    data.receipt_result ===
                                                    "pass"
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "receipt_result",
                                                        e.target.value
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            <CheckCircle className="w-5 h-5 text-green-600 mr-1" />
                                            <span className="text-sm font-medium text-gray-700">
                                                Pass
                                            </span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="fail"
                                                checked={
                                                    data.receipt_result ===
                                                    "fail"
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "receipt_result",
                                                        e.target.value
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            <XCircle className="w-5 h-5 text-red-600 mr-1" />
                                            <span className="text-sm font-medium text-gray-700">
                                                Fail
                                            </span>
                                        </label>
                                    </div>
                                    {errors.receipt_result && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.receipt_result}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Remarks
                                    </label>
                                    <textarea
                                        value={data.receipt_remarks}
                                        onChange={(e) =>
                                            setData(
                                                "receipt_remarks",
                                                e.target.value
                                            )
                                        }
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Add any specific remarks or observations..."
                                    />
                                    {errors.receipt_remarks && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.receipt_remarks}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* DTI */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2" />
                                DTI Registration
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Photo (Leave empty to keep
                                        current)
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex-1 cursor-pointer">
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                                {previews.dti_photo ? (
                                                    <div>
                                                        <img
                                                            src={
                                                                previews.dti_photo
                                                            }
                                                            alt="Preview"
                                                            className="mx-auto h-32 w-auto rounded"
                                                        />
                                                        <p className="mt-2 text-sm text-gray-600">
                                                            Click to change
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                        <p className="mt-2 text-sm text-gray-600">
                                                            Click to upload
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            PNG, JPG up to 5MB
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleFileChange(
                                                        e,
                                                        "dti_photo"
                                                    )
                                                }
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    {errors.dti_photo && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.dti_photo}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Result{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="pass"
                                                checked={
                                                    data.dti_result === "pass"
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "dti_result",
                                                        e.target.value
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            <CheckCircle className="w-5 h-5 text-green-600 mr-1" />
                                            <span className="text-sm font-medium text-gray-700">
                                                Pass
                                            </span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="fail"
                                                checked={
                                                    data.dti_result === "fail"
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "dti_result",
                                                        e.target.value
                                                    )
                                                }
                                                className="mr-2"
                                            />
                                            <XCircle className="w-5 h-5 text-red-600 mr-1" />
                                            <span className="text-sm font-medium text-gray-700">
                                                Fail
                                            </span>
                                        </label>
                                    </div>
                                    {errors.dti_result && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.dti_result}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Remarks
                                    </label>
                                    <textarea
                                        value={data.dti_remarks}
                                        onChange={(e) =>
                                            setData(
                                                "dti_remarks",
                                                e.target.value
                                            )
                                        }
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Add any specific remarks or observations..."
                                    />
                                    {errors.dti_remarks && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.dti_remarks}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* General Remarks */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                General Remarks
                            </h2>
                            <textarea
                                value={data.general_remarks}
                                onChange={(e) =>
                                    setData("general_remarks", e.target.value)
                                }
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Add any general observations or comments about this lab report..."
                            />
                            {errors.general_remarks && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.general_remarks}
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-4">
                            <Link
                                href={route("lab-reports.index")}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing
                                    ? "Updating..."
                                    : "Update Lab Report"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
