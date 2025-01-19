"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Result {
	draw_id: number;
	draw_date: string;
	user_numbers: number[];
	winning_numbers: number[] | null;
	matched_numbers: number | null;
	status: string;
}

interface ResultsResponse {
	success: boolean;
	ticket_id: number;
	results: Result[];
}

const TicketResults: React.FC = () => {
	const { ticketId } = useParams();
	const router = useRouter();
	const [resultsData, setResultsData] = useState<ResultsResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchResults = async () => {
			if (!ticketId) return;

			try {
				const token = sessionStorage.getItem("authToken");
				if (!token) {
					throw new Error("Brak tokena autoryzacyjnego.");
				}

				const response = await fetch(
					`http://localhost/api/tickets/${ticketId}/results`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!response.ok) {
					throw new Error("Nie udało się pobrać wyników.");
				}

				const data: ResultsResponse = await response.json();
				setResultsData(data);
			} catch (error: any) {
				console.error(error);
				setError(error.message || "Nie udało się pobrać wyników.");
			} finally {
				setLoading(false);
			}
		};

		fetchResults();
	}, [ticketId]);

	if (loading) return <p>Ładowanie wyników...</p>;
	if (error) return <p className='text-red-500'>{error}</p>;
	if (!resultsData || !resultsData.success) return <p>Brak danych wyników.</p>;

	return (
		<div className='container mx-auto p-6'>
			<h1 className='text-3xl font-bold mb-6 text-black'>
				Wyniki dla biletu #{resultsData.ticket_id}
			</h1>
			<div className='bg-white p-6 rounded-lg shadow-md mb-4'>
				{resultsData.results.map((result) => (
					<div
						key={result.draw_id}
						className='border-b border-gray-300 pb-4 mb-4'>
						<h2 className='text-2xl font-semibold text-black'>
							Losowanie -{" "}
							{new Date(result.draw_date).toLocaleString("pl-PL", {
								year: "numeric",
								month: "long",
								day: "numeric",
								hour: "2-digit",
								minute: "2-digit",
							})}
						</h2>
						<p className='text-black'>
							Twoje liczby: {result.user_numbers.join(", ")}
						</p>
						{result.status === "pending" ? (
							<p className='text-black'>Losowanie nie odbyło się jeszcze.</p>
						) : (
							<>
								<p className='text-black'>
									Wygrane liczby:{" "}
									{result.winning_numbers?.join(", ") || "Brak wyników"}
								</p>
								<p className='text-black'>
									Trafione liczby:{" "}
									{result.matched_numbers !== null
										? result.matched_numbers
										: "Brak danych"}
								</p>
								<p className='text-black'>
									{result.matched_numbers && result.matched_numbers >= 3
										? `Gratulacje! Wygrałeś ${calculatePrize(
												result.matched_numbers
										  )} zł.`
										: "Niestety, nic nie wygrałeś."}
								</p>
							</>
						)}
					</div>
				))}
			</div>
			<button
				className='bg-blue-500 text-white px-4 py-2 rounded'
				onClick={() => router.push("/user/dashboard")}>
				Powrót
			</button>
		</div>
	);
};

const calculatePrize = (matchedNumbers: number): string => {
	switch (matchedNumbers) {
		case 3:
			return "100";
		case 4:
			return "1000";
		case 5:
			return "10000";
		case 6:
			return "1000000";
		default:
			return "0";
	}
};

export default TicketResults;
