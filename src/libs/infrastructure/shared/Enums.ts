export enum FilterOperator {
  Contains = 1,
  DoesNotContains = 2,
  Equals = 3,
  DoesNotEquals = 4,
  BeginsWith = 5,
  EndsWith = 6,
  Blank = 7,
  NotBlank = 8,
}

export enum SessionStorage {
  SelectedMenuItem = "selected-menu-item",
  MenuIsLocked = "is-menu-locked",
}

export enum DispatchEvent {
  SelectedMenuItem = "selectedMenuItem",
  MenuLock = "menuLock",
}
