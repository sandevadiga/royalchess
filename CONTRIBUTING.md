# 🤝 Contributing Guidelines

## 🔴 CRITICAL RULE

```
⚠️ WHEN YOU CHANGE CODE → UPDATE THE README
```

**NO EXCEPTIONS!**

---

## 📋 Documentation Update Checklist

### **Every Code Change Must:**

- [ ] Update the file's README (in same folder)
- [ ] Update parent folder README
- [ ] Update main README.md (if significant change)
- [ ] Update line counts
- [ ] Update performance info (if optimized)
- [ ] Update dependencies (if changed)
- [ ] Update usage examples (if API changed)

---

## 🔄 Workflow

### **1. Before Coding:**
```bash
# Read relevant READMEs
cat components/ui/README.md
cat components/README.md
cat README.md
```

### **2. Make Code Changes:**
```typescript
// Your code changes here
```

### **3. Update Documentation:**
```bash
# Update all affected READMEs
# - File's own README
# - Folder README
# - Main README (if needed)
```

### **4. Commit:**
```bash
git add .
git commit -m "feat: Add feature X + Update READMEs"
```

---

## 📚 Which READMEs to Update

### **Scenario 1: Modify Existing Component**
```
Change: components/ui/Button.tsx
Update:
  ✅ components/ui/README.md
  ✅ components/README.md (if usage changed)
```

### **Scenario 2: Add New Component**
```
Add: components/ui/NewComponent.tsx
Update:
  ✅ components/ui/README.md (add to file list)
  ✅ components/README.md (update count)
  ✅ components/index.ts (export)
  ✅ README.md (update stats)
```

### **Scenario 3: Optimize Performance**
```
Optimize: Add React.memo to Button.tsx
Update:
  ✅ components/ui/README.md (add performance info)
  ✅ components/README.md (update metrics)
  ✅ README.md (update performance score)
```

### **Scenario 4: Change Component API**
```
Change: Button props interface
Update:
  ✅ components/ui/README.md (update props docs)
  ✅ QUICK_START.md (update examples)
```

---

## ✅ README Update Template

### **For Component README:**
```markdown
## Component Name

**Lines:** [UPDATE THIS]
**Status:** ✅ Active
**Optimized:** ⚡ memo/useCallback/useMemo

**Props:**
```typescript
// UPDATE PROPS HERE
```

**Used In:**
- ✅ [UPDATE USAGE LIST]

**Performance:**
- ⚡ [UPDATE PERFORMANCE INFO]
```

---

## 🚫 Common Mistakes

### **❌ DON'T:**
- Change code without updating README
- Update only one README (update all affected)
- Leave outdated line counts
- Forget to update performance info
- Skip updating usage examples

### **✅ DO:**
- Update all affected READMEs
- Keep line counts accurate
- Document performance changes
- Update usage examples
- Test documentation accuracy

---

## 🎯 Examples

### **Example 1: Add React.memo**

**Code Change:**
```typescript
// Button.tsx
export default memo(Button);
```

**README Updates:**

1. `components/ui/README.md`:
```markdown
| Button.tsx | 70 lines | ⚡ memo |
Performance: 70% fewer re-renders
```

2. `components/README.md`:
```markdown
| ui/ | 5 | ⚡ 100% optimized |
```

3. `README.md`:
```markdown
Performance Score: 9.5/10 ⚡
```

---

### **Example 2: Add New Component**

**Code Change:**
```typescript
// components/ui/LoadingSpinner.tsx
export default function LoadingSpinner() { ... }
```

**README Updates:**

1. `components/ui/README.md`:
```markdown
| LoadingSpinner.tsx | 30 lines | ✅ Active |
```

2. `components/README.md`:
```markdown
| ui/ | 6 | (was 5) |
Total: 12 components (was 11)
```

3. `components/index.ts`:
```typescript
export { default as LoadingSpinner } from './ui/LoadingSpinner';
```

4. `README.md`:
```markdown
Components: 12 (was 11)
```

---

## 🔍 Review Checklist

Before submitting PR:

- [ ] All code changes documented
- [ ] All READMEs updated
- [ ] Line counts accurate
- [ ] Performance info current
- [ ] Usage examples updated
- [ ] No outdated information
- [ ] Links working
- [ ] Formatting correct

---

## 🎓 Why This Rule?

### **Benefits:**
✅ Documentation always accurate  
✅ Easy onboarding for new developers  
✅ Clear change history  
✅ No confusion about what changed  
✅ Professional codebase  

### **Without This Rule:**
❌ Outdated documentation  
❌ Confusion about components  
❌ Wasted time searching  
❌ Errors from wrong info  
❌ Unprofessional codebase  

---

## 📞 Questions?

If unsure which READMEs to update:
1. Check the file you changed
2. Update its folder README
3. Check if it affects parent folders
4. Update main README if significant

**When in doubt, update more rather than less!**

---

**Remember: Code without documentation is incomplete code!** 📚

**ALWAYS UPDATE THE README!** ⚠️
