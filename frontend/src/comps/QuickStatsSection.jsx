
import {
    MoreHorizontal,
    Globe

} from "lucide-react";
import {BarChart, Bar,Legend, Tooltip, XAxis, YAxis, CartesianGrid, ResponsiveContainer} from "recharts"


function Charts() {
    const data = [
        { name: "Jan", sales: 400 },
        { name: "Feb", sales: 300 },
        { name: "Mar", sales: 500 },
        { name: "Apr", sales: 200 },
    ];

    return(
        <ResponsiveContainer width = "100%" height = {400}>
            <BarChart data={data}>

                <XAxis dataKey="name" />



                <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>

        </ResponsiveContainer>


    )
}
function QuickStatsSection({ stats }) {



    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Quick Stats</h3>
                <button className="text-gray-400 hover:text-white">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Progress Circle (simplified representation) */}
            <div className="text-center mb-6">
                <div className="relative inline-block">
                    <div className="w-20 h-20 bg-[#656fe2] rounded-full flex items-center justify-center mx-auto mb-3">
                        <Globe className="text-white" size={32} />
                    </div>
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        {Math.round((stats.countriesVisited / 195) * 100)}%
                    </div>
                </div>
                <h4 className="text-white font-semibold mb-1">Countries Explored</h4>
                <p className="text-gray-400 text-sm">{stats.countriesVisited} of 195 countries visited</p>
            </div>

            {/* Mini Chart Representation */}
            <Charts />
        </div>
    );
}

export default QuickStatsSection;