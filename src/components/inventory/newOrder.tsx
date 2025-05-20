import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { DialogHeader } from "../ui/dialog";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function NewOrder(props: any) {
    return (
        <Dialog open={props?.orderDialogOpen} onOpenChange={props?.setOrderDialogOpen}>
            <DialogContent className="max-w-3xl border">
                <DialogHeader>
                    <DialogTitle>Order Summary</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="max-h-[400px] overflow-y-auto pr-2">
                        {Object.entries(props?.selectedProducts as Record<string, number>).map(([productId, quantity]) => {
                            const product = props?.products.find((p: { _id: string; }) => p._id === productId);
                            return product ? (
                                <div
                                    key={productId}
                                    className="flex items-center justify-between border-b border-border py-3"
                                >
                                    <div>
                                        <div className="font-medium">{product.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            Unit Price: ₹{product.price.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e: { stopPropagation: () => void; }) => {
                                                    e.stopPropagation();
                                                    props?.handleProductQuantityChange(productId, Math.max(1, quantity - 1));
                                                }}
                                            >
                                                -
                                            </Button>
                                            <span className="px-3 min-w-[40px] text-center">
                                                {quantity}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e: { stopPropagation: () => void; }) => {
                                                    e.stopPropagation();
                                                    props?.handleProductQuantityChange(productId, quantity + 1);
                                                }}
                                            >
                                                +
                                            </Button>
                                        </div>
                                        <div className="font-medium">
                                            ₹{(product.price * quantity).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ) : null;
                        })}
                    </div>
                    <div className="border-t border-border pt-4">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-medium">Total Amount</span>
                            <span className="font-medium text-lg">₹{props?.totalOrderAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-medium">Total Count</span>
                            <span className="font-medium text-lg">₹{props?.totalOrderCount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-medium">Total Types</span>
                            <span className="font-medium text-lg">₹{props?.totalOrderType.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => props?.setOrderDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={props?.handlePlaceOrder} disabled={Object.keys(props?.selectedProducts).length === 0}>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Place Order
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}