
import React from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const itemRenderer = (item) => (
        <a className="flex align-items-center p-menuitem-link">
            <span className={item.icon} />
            <span className="mx-2">{item.label}</span>
            {item.badge && <Badge className="ml-auto" value={item.badge} />}
            {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
        </a>
    );
    const navigate = useNavigate();
    const items = [
        {
            label: 'Cadastro',
            items: [
                {
                    label: 'Bairros',
                    icon: 'pi pi-map-marker',
                    template: itemRenderer,
                    command: () => navigate('/neighborhood')
                },
                {
                    separator: true
                },
                {
                    label: 'Cidades',
                    icon: 'pi pi-map-marker',
                    template: itemRenderer,
                    command: () => navigate('/city')
                },
                {
                    separator: true
                },
                {
                    label: 'Pessoas',
                    icon: 'pi pi-user',
                    template: itemRenderer,
                    command: () => navigate('/people')
                },
                {
                    separator: true
                },
                {
                    label: 'Produtos',
                    icon: 'pi pi-shopping-bag',
                    template: itemRenderer,
                    command: () => navigate('/product')
                },

            ]
        },
        {
            label: 'Movimento',
            items: [
                {
                    label: 'Vendas',
                    icon: 'pi pi-shopping-bag',
                    template: itemRenderer,
                    command: () => navigate('/sales')
                },

            ]
        },
        {
            label: 'Relatórios',
            items: [
                {
                    label: 'Lista de Pessoas',
                    icon: 'pi pi-user',
                    template: itemRenderer
                },
                {
                    separator: true
                },
                {
                    label: 'Lista de Vendas',
                    icon: 'pi pi-shopping-bag',
                    template: itemRenderer
                }
            ]
        }
    ];
    const end = (
        <div className="flex align-items-center gap-2">
            ADMIN
        </div>
    );

    return (
        <div className="card">
            <Menubar model={items} end={end} />
        </div>
    )
}
