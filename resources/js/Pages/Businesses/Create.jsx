import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Building2,
    User,
    MapPin,
    Phone,
    Mail,
    Users,
    FileText,
    ArrowLeft,
    Save,
} from "lucide-react";

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        business_name: "",
        owner_name: "",
        business_type: "Food Establishment",
        address: "",
        barangay: "",
        contact_number: "",
        email: "",
        establishment_category: "",
        number_of_employees: "",
    });

    // Barangays of Tibiao, Antique
    const barangays = [
        "Alegre",
        "Amar",
        "Bandoja",
        "Castillo",
        "Esparagoza",
        "Importante",
        "La Paz",
        "Malabor",
        "Martinez",
        "Natividad",
        "Poblacion",
        "Pitac",
        "Salazar",
        "San Francisco Norte",
        "San Francisco Sur",
        "San Isidro",
        "Santa Ana",
        "Santa Justa",
        "Santo Rosario",
        "Tigbaboy",
        "Tuno",
    ];

    const foodEstablishmentCategories = [
        "Restaurant",
        "Fast Food",
        "Cafeteria",
        "Catering Service",
        "Canteen",
        "Bakery",
        "Food Cart/Stall",
        "Grocery Store",
        "Sari-sari Store",
        "Meat Shop",
        "Seafood Market",
        "Others",
    ];

    const nonFoodEstablishmentCategories = [
        "Salon/Barber Shop",
        "Spa/Massage Center",
        "Hotel/Inn/Lodging",
        "School/Day Care",
        "Clinic/Hospital",
        "Funeral Parlor",
        "Mall/Shopping Center",
        "Market",
        "Public Pool/Resort",
        "Gym/Fitness Center",
        "Others",
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Form data:", data); // Debug log

        post(route("businesses.store"), {
            onSuccess: () => {
                console.log("Business registered successfully");
            },
            onError: (errors) => {
                console.error("Form errors:", errors);
            },
        });
    };

    const handleBusinessTypeChange = (e) => {
        const newType = e.target.value;
        setData({
            ...data,
            business_type: newType,
            establishment_category: "", // Reset category when type changes
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Register Business" />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={route("businesses.index")}
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Businesses
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Register New Business
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Fill out the form below to register a new business
                            establishment
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            {/* Business Information */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center mb-4">
                                    <Building2 className="w-5 h-5 text-blue-600 mr-2" />
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Business Information
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Business Name */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Business Name{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.business_name}
                                            onChange={(e) =>
                                                setData(
                                                    "business_name",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter business name"
                                            required
                                        />
                                        {errors.business_name && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.business_name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Business Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Business Type{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            value={data.business_type}
                                            onChange={handleBusinessTypeChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="Food Establishment">
                                                Food Establishment
                                            </option>
                                            <option value="Non-Food Establishment">
                                                Non-Food Establishment
                                            </option>
                                        </select>
                                        {errors.business_type && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.business_type}
                                            </p>
                                        )}
                                    </div>

                                    {/* Establishment Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Establishment Category
                                        </label>
                                        <select
                                            value={data.establishment_category}
                                            onChange={(e) =>
                                                setData(
                                                    "establishment_category",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">
                                                Select category
                                            </option>
                                            {(data.business_type ===
                                            "Food Establishment"
                                                ? foodEstablishmentCategories
                                                : nonFoodEstablishmentCategories
                                            ).map((category) => (
                                                <option
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.establishment_category && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.establishment_category}
                                            </p>
                                        )}
                                    </div>

                                    {/* Number of Employees */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Number of Employees
                                        </label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="number"
                                                value={data.number_of_employees}
                                                onChange={(e) =>
                                                    setData(
                                                        "number_of_employees",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter number of employees"
                                                min="0"
                                            />
                                        </div>
                                        {errors.number_of_employees && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.number_of_employees}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Owner Information */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center mb-4">
                                    <User className="w-5 h-5 text-blue-600 mr-2" />
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Owner Information
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Owner Name */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Owner Name{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.owner_name}
                                            onChange={(e) =>
                                                setData(
                                                    "owner_name",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter owner's full name"
                                            required
                                        />
                                        {errors.owner_name && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.owner_name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Contact Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contact Number{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={data.contact_number}
                                                onChange={(e) =>
                                                    setData(
                                                        "contact_number",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="09XX XXX XXXX"
                                                required
                                            />
                                        </div>
                                        {errors.contact_number && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.contact_number}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address (Optional)
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="owner@example.com"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Location Information */}
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Location Information
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Address */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Street Address{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    "address",
                                                    e.target.value
                                                )
                                            }
                                            rows="3"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter complete address"
                                            required
                                        ></textarea>
                                        {errors.address && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.address}
                                            </p>
                                        )}
                                    </div>

                                    {/* Barangay */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Barangay{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            value={data.barangay}
                                            onChange={(e) =>
                                                setData(
                                                    "barangay",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="">
                                                Select barangay
                                            </option>
                                            {barangays.map((barangay) => (
                                                <option
                                                    key={barangay}
                                                    value={barangay}
                                                >
                                                    {barangay}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.barangay && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.barangay}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="mt-6 flex items-center justify-end gap-4">
                            <Link
                                href={route("businesses.index")}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-5 h-5 mr-2" />
                                {processing
                                    ? "Registering..."
                                    : "Register Business"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
