import React from 'react';
import { Container, Card, Button, Grid, Flex, Input, Select, Badge } from '@/components/ui';

// Exemplo de uso dos componentes refatorados
export default function ExamplePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header usando Container e Flex */}
            <div className="bg-primary shadow-lg">
                <Container>
                    <Flex justify="between" align="center" className="py-4">
                        <h1 className="heading-2 text-white">Exemplo de Página</h1>
                        <Button variant="secondary" className="bg-white text-primary">
                            Ação
                        </Button>
                    </Flex>
                </Container>
            </div>

            {/* Conteúdo principal */}
            <Container className="py-6">
                {/* Grid responsivo */}
                <Grid cols={3} gap="md" className="mb-6">
                    <Card>
                        <h2 className="heading-4 mb-4">Card 1</h2>
                        <p className="text-body">Conteúdo do primeiro card</p>
                    </Card>

                    <Card variant="elevated">
                        <h2 className="heading-4 mb-4">Card 2</h2>
                        <p className="text-body">Conteúdo do segundo card</p>
                    </Card>

                    <Card variant="outlined">
                        <h2 className="heading-4 mb-4">Card 3</h2>
                        <p className="text-body">Conteúdo do terceiro card</p>
                    </Card>
                </Grid>

                {/* Formulário usando componentes base */}
                <Card className="max-w-2xl mx-auto">
                    <h2 className="heading-3 mb-4">Formulário de Exemplo</h2>

                    <div className="space-y-4">
                        <Input
                            label="Nome"
                            placeholder="Digite seu nome"
                            helperText="Este campo é obrigatório"
                        />

                        <Select
                            label="Clã"
                            options={[
                                { value: 'uchiha', label: 'Uchiha' },
                                { value: 'hyuga', label: 'Hyuga' },
                                { value: 'nara', label: 'Nara' }
                            ]}
                        />

                        <Flex justify="end" gap="md">
                            <Button variant="ghost">Cancelar</Button>
                            <Button variant="primary">Salvar</Button>
                        </Flex>
                    </div>
                </Card>

                {/* Badges de exemplo */}
                <div className="mt-6">
                    <h3 className="heading-4 mb-4">Badges</h3>
                    <Flex gap="sm" wrap>
                        <Badge variant="default">Padrão</Badge>
                        <Badge variant="success">Sucesso</Badge>
                        <Badge variant="warning">Aviso</Badge>
                        <Badge variant="error">Erro</Badge>
                        <Badge variant="info">Info</Badge>
                    </Flex>
                </div>
            </Container>
        </div>
    );
}
