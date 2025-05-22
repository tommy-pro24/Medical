import React, { useState } from "react";
import { AlertTriangle, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useData } from "@/context/DataContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductItem(props: any) {

    const { getCurrentUser } = useData();
    const [error, setError] = useState<Record<string, string>>({});
    const [clientQty, setClientQty] = useState('');

    React.useEffect(() => {
        if (props.isSelected) {
            const val = props.selectedProducts[props.product._id];
            setClientQty(val !== undefined ? String(val) : '');
        }
    }, [props.isSelected, props.selectedProducts, props.product._id]);

    const commitClientQty = () => {
        if (clientQty === '' || clientQty === '0' || Number(clientQty) <= 0 || isNaN(Number(clientQty))) {
            props.handleProductQuantityChange(props.product._id, '');
        } else {
            props.handleProductQuantityChange(props.product._id, Number(clientQty));
        }
    };

    return (
        <Card
            className={`overflow-hidden cursor-pointer transition-all rounded-md shadow-sm p-2 w-full ${props?.isSelected ? 'border-blue-500 ring-2 ring-blue-400' : ((getCurrentUser()?.role !== 'client') && (props?.product.stockNumber <= props?.product.lowStockThreshold)) ? 'border-amber-500/50' : 'border-input'}`}
            onClick={() => props?.currentUser?.role === 'client' && props?.handleSelectProduct(props?.product._id)}
        >
            <CardHeader className="pb-2 px-2 pt-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        {props?.product.name}
                        {props?.isSelected && (
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-500" title="Selected"></span>
                        )}
                    </CardTitle>
                    {((getCurrentUser()?.role !== 'client') && (props?.product.stockNumber <= props?.product.lowStockThreshold)) && (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                </div>
                <div className="text-xs text-muted-foreground capitalize">{props?.product.category}</div>
            </CardHeader>
            <CardContent className="space-y-2 px-2 pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs">Stock Level:</span>
                    </div>
                    <div
                        className={`font-medium text-xs ${((getCurrentUser()?.role !== 'client') && (props?.product.stockNumber <= props?.product.lowStockThreshold)) ? 'text-amber-500' : 'text-foreground'}`}
                    >
                        {props?.product.stockNumber} <span className="font-normal">units</span>
                    </div>
                </div>
                <div className="text-xs line-clamp-2 min-h-[32px]">{props?.product.description}</div>
                <div className="pt-1 flex justify-between gap-1">
                    {/* For client: show quantity input only if selected, no Add to Order button */}
                    {props?.currentUser?.role === 'client' ? (
                        <Input
                            type="number"
                            value={clientQty}
                            onChange={e => {
                                let value = e.target.value;
                                value = value.replace(/^0+(?!$)/, '');
                                setClientQty(value);
                            }}
                            onBlur={commitClientQty}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    commitClientQty();
                                }
                            }}
                            placeholder="Qty"
                            min="0"
                            disabled={!props?.isSelected}
                            onClick={e => e.stopPropagation()}
                            className={`h-7 px-2 py-1 text-xs ${props?.isSelected ? '' : 'opacity-50'}`}
                        />
                    ) : props?.currentUser?.role === 'admin' ? (
                        <>
                            <div className="flex flex-col gap-1 w-full">
                                <Input
                                    type="number"
                                    value={
                                        props?.productCounts[props?.product._id] !== undefined
                                            ? String(props?.productCounts[props?.product._id])
                                            : ''
                                    }
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        value = value.replace(/^0+(?!$)/, '');
                                        setError((prev) => ({ ...prev, [props?.product._id]: '' }));
                                        props?.setProductCounts((prev: Record<string, string>) => ({
                                            ...prev,
                                            [props?.product._id]: value
                                        }));
                                    }}
                                    placeholder="Qty"
                                    className="h-7 px-2 py-1 text-xs"
                                />
                                {error[props?.product._id] && (
                                    <span className="block text-[10px] text-red-400">{error[props?.product._id]}</span>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const value = props?.productCounts[props?.product._id];
                                    if (!value || isNaN(Number(value)) || Number(value) < 1) {
                                        setError((prev) => ({ ...prev, [props?.product._id]: 'Please enter a valid quantity (at least 1).' }));
                                        return;
                                    }
                                    setError((prev) => ({ ...prev, [props?.product._id]: '' }));
                                    props?.handleUpdateStock(props?.product._id, props?.product.stockNumber + Number(value));
                                }}
                                className="flex-1 h-7 px-2 py-1 text-xs"
                            >
                                Add
                            </Button>
                        </>
                    ) : <></>}
                </div>
                {/* Only show Edit Product for non-client */}
                {props?.currentUser?.role == 'admin' && (
                    <div className="pt-1">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-full h-7 text-xs"
                            onClick={() => props?.handleEditProduct(props?.product)}
                        >
                            Edit Product
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}