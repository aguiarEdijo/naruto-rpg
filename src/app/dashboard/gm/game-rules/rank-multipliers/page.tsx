'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RankMultipliersPage() {
    const router = useRouter();
    
    useEffect(() => {
        router.replace('/dashboard/gm/game-rules/ranks-config');
    }, [router]);

    return null;
    const { data: rankMultipliers = [], isLoading } = useRankMultipliers();
    const { updateRankMultiplier } = useRankMultiplierMutations();

    const [editing, setEditing] = useState<Record<string, number>>({});
    const [submitting, setSubmitting] = useState(false);

    const handleEdit = (rank: JutsuRank, multiplier: number) => {
        setEditing(prev => ({ ...prev, [rank]: multiplier }));
    };

    const handleSave = async (rank: JutsuRank) => {
        const multiplier = editing[rank];
        if (multiplier === undefined) return;

        try {
            setSubmitting(true);
            await updateRankMultiplier.mutateAsync({ rank, multiplier });
            setEditing(prev => {
                const newEditing = { ...prev };
                delete newEditing[rank];
                return newEditing;
            });
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar multiplicador. Verifique o console.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = (rank: JutsuRank) => {
        setEditing(prev => {
            const newEditing = { ...prev };
            delete newEditing[rank];
            return newEditing;
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <GMHeader title="Multiplicadores de Rank" backLink="/dashboard/gm/game-rules" />
                <Container className="py-8">
                    <Card>
                        <div className="text-center py-8">Carregando...</div>
                    </Card>
                </Container>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <GMHeader
                title="Multiplicadores de Rank"
                description="Configure os multiplicadores para cada rank de jutsu"
                backLink="/dashboard/gm/game-rules"
            />

            <Container className="py-8">
                <Card>
                    <div className="space-y-4">
                        <div className="border-b pb-4 mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Multiplicadores por Rank</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Configure o multiplicador utilizado para cada rank de jutsu (E, D, C, B, A, S)
                            </p>
                        </div>

                        <div className="space-y-3">
                            {RANK_ORDER.map((rank) => {
                                const rankData = rankMultipliers.find(rm => rm.rank === rank);
                                const isEditing = editing[rank] !== undefined;
                                const currentValue = isEditing ? editing[rank] : (rankData?.multiplier ?? 0);

                                return (
                                    <div
                                        key={rank}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-lg">
                                                <span className="text-xl font-bold text-primary">{rank}</span>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">Rank {rank}</div>
                                                <div className="text-sm text-gray-500">Multiplicador</div>
                                            </div>
                                        </div>

                                        {isEditing ? (
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    value={currentValue}
                                                    onChange={(e) => handleEdit(rank, parseInt(e.target.value) || 0)}
                                                    className="w-24"
                                                    min="0"
                                                />
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handleSave(rank)}
                                                    disabled={submitting}
                                                >
                                                    Salvar
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleCancel(rank)}
                                                    disabled={submitting}
                                                >
                                                    Cancelar
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-4">
                                                <div className="text-2xl font-bold text-gray-900">{currentValue}</div>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleEdit(rank, currentValue)}
                                                >
                                                    Editar
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Card>
            </Container>
        </div>
    );
}

