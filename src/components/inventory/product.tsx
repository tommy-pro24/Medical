import { AlertTriangle, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductItem(props: any) {
    return (
        <Card
            className={`overflow-hidden cursor-pointer transition-all ${props?.isSelected ? 'border-blue-500 ring-2 ring-blue-400' : props?.product.stockNumber <= props?.product.lowStockThreshold ? 'border-amber-500/50' : 'border-input'}`}
            onClick={() => props?.currentUser?.role === 'client' && props?.handleSelectProduct(props?.product._id)}
        >
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        {props?.product.name}
                        {props?.isSelected && (
                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500" title="Selected"></span>
                        )}
                    </CardTitle>
                    {props?.product.stockNumber <= props?.product.lowStockThreshold && (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                    )}
                </div>
                <div className="text-sm text-muted-foreground capitalize">{props?.product.category}</div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <span>Stock Level:</span>
                    </div>
                    <div
                        className={`font-medium ${props?.product.stockNumber <= props?.product.lowStockThreshold ? 'text-amber-500' : 'text-foreground'}`}
                    >
                        {props?.product.stockNumber} units
                    </div>
                </div>
                <div className="text-sm">{props?.product.description}</div>
                <div className="pt-2 flex justify-between gap-2">
                    {/* For client: show quantity input only if selected, no Add to Order button */}
                    {props?.currentUser?.role === 'client' ? (
                        <Input
                            type="number"
                            value={props?.selectedProducts[props?.product._id] || ''}
                            onChange={e => props?.handleProductQuantityChange(props?.product._id, Number(e.target.value))}
                            placeholder="Qty"
                            min="1"
                            disabled={!props?.isSelected}
                            onClick={e => e.stopPropagation()}
                            className={props?.isSelected ? '' : 'opacity-50'}
                        />
                    ) : props?.currentUser?.role === 'admin' ? (
                        <>
                            <Input
                                type="number"
                                value={props?.productCounts[props?.product._id] || 0}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange={(e) => props?.setProductCounts((prev: any) => ({
                                    ...prev,
                                    [props?.product._id]: Number(e.target.value)
                                }))}
                                placeholder="Enter quantity"
                            />
                            <Button
                                variant="outline"
                                onClick={() => props?.handleUpdateStock(props?.product._id, props?.product.stockNumber + (props?.productCounts[props?.product._id] || 0))}
                                className="flex-1"
                            >
                                Add
                            </Button>
                        </>
                    ) : <></>}
                </div>
                {/* Only show Edit Product for non-client */}
                {props?.currentUser?.role == 'admin' && (
                    <div className="pt-2">
                        <Button
                            variant="secondary"
                            className="w-full"
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