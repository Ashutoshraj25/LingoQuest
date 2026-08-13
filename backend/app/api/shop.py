from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import ShopItem, User, UserInventory
from app.schemas.schemas import PurchaseRequest, ShopItemSchema
from typing import List

router = APIRouter(prefix="/shop", tags=["Shop"])

@router.get("/items", response_model=List[ShopItemSchema])
def get_shop_items(db: Session = Depends(get_db)):
    items = db.query(ShopItem).all()
    return [ShopItemSchema.from_orm(item) for item in items]

@router.post("/purchase")
def purchase_item(req: PurchaseRequest, user_id: int = 1, db: Session = Depends(get_db)):
    item = db.query(ShopItem).filter(ShopItem.id == req.shop_item_id).first()
    user = db.query(User).filter(User.id == user_id).first()

    if not item or not user:
        raise HTTPException(status_code=404, detail="Item or User not found")

    if user.gems < item.price_gems and item.price_gems > 0:
        raise HTTPException(status_code=400, detail="Insufficient gems!")

    # Deduct gems
    user.gems -= item.price_gems

    # Apply effect based on item category
    if item.category == "heart":
        user.hearts = user.max_hearts
    elif item.category == "gem":
        user.gems += 500  # Added small gem pack

    # Record inventory
    inv = db.query(UserInventory).filter(
        UserInventory.user_id == user.id,
        UserInventory.shop_item_id == item.id
    ).first()

    if inv:
        inv.quantity += 1
    else:
        inv = UserInventory(user_id=user.id, shop_item_id=item.id, quantity=1)
        db.add(inv)

    db.commit()

    return {
        "message": f"Successfully purchased {item.name}!",
        "new_gems": user.gems,
        "new_hearts": user.hearts
    }
