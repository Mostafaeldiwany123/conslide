using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices;
using System.Text;
using System.Web.Script.Serialization;

namespace Conslide
{
    public class PowerPointService
    {
        private dynamic _app;

        // msoAlign constants
        private const int msoAlignLefts   = 0;
        private const int msoAlignCenters = 2;
        private const int msoAlignRights  = 1;
        private const int msoAlignTops    = 3;
        private const int msoAlignMiddles = 4;
        private const int msoAlignBottoms = 5;

        // msoDistribute constants
        private const int msoDistributeHorizontally = 0;
        private const int msoDistributeVertically   = 1;

        // msoFalse / msoTrue
        private const int msoFalse = 0;
        private const int msoTrue  = -1;

        // PowerPoint shape types
        private const int msoShapeRectangle = 1;
        private const int msoShapeOval      = 9;

        // ── State polling ──────────────────────────────────────────────────────
        /// <summary>Returns true when the user is currently editing text in PPT.</summary>
        public bool IsTextEditing()
        {
            try
            {
                if (_app == null && !Connect()) return false;
                // ppSelectionText = 3 means a text range is active (cursor in text box)
                return (int)_app.ActiveWindow.Selection.Type == 3;
            }
            catch { return false; }
        }

        public int GetSelectionCount()
        {
            if (!Connect()) return 0;
            try 
            {
                var sel = _app.ActiveWindow.Selection;
                if ((int)sel.Type == 2) return sel.ShapeRange.Count; // msoSelectionShapes
                if ((int)sel.Type == 3) return 1;                   // msoSelectionText counts as 1 for text ops
                return 0;
            }
            catch { return 0; }
        }

        private bool Connect()
        {
            try
            {
                _app = Marshal.GetActiveObject("PowerPoint.Application");
                return _app != null;
            }
            catch { return false; }
        }

        private dynamic GetShapes()
        {
            try { return _app.ActiveWindow.Selection.ShapeRange; }
            catch { return null; }
        }

        private dynamic GetSlide()
        {
            try { return _app.ActiveWindow.View.Slide; }
            catch { return null; }
        }

        // ── Align ─────────────────────────────────────────────────────────────
        public void AlignLeft()     => AlignShapes(msoAlignLefts);
        public void AlignRight()    => AlignShapes(msoAlignRights);
        public void AlignTop()      => AlignShapes(msoAlignTops);
        public void AlignBottom()   => AlignShapes(msoAlignBottoms);

        public void AlignCenterH() => AlignShapes(msoAlignCenters);
        public void AlignMiddleV() => AlignShapes(msoAlignMiddles);

        private void AlignShapes(int alignType)
        {
            if (!Connect()) return;
            try
            {
                var shapes = GetShapes();
                if (shapes == null || shapes.Count < 1) return;

                // 1 Shape: Align to Slide
                if (shapes.Count == 1)
                {
                    shapes.Align(alignType, msoTrue);
                    return;
                }

                // Multiple Shapes: First shape is the "Master" (Reference)
                var master = shapes[1];
                float mL = (float)master.Left;
                float mT = (float)master.Top;
                float mW = (float)master.Width;
                float mH = (float)master.Height;

                for (int i = 2; i <= shapes.Count; i++)
                {
                    var s = shapes[i];
                    switch (alignType)
                    {
                        case msoAlignLefts:   s.Left = mL; break;
                        case msoAlignRights:  s.Left = mL + mW - (float)s.Width; break;
                        case msoAlignCenters: s.Left = mL + (mW - (float)s.Width) / 2; break;
                        case msoAlignTops:    s.Top  = mT; break;
                        case msoAlignBottoms: s.Top  = mT + mH - (float)s.Height; break;
                        case msoAlignMiddles: s.Top  = mT + (mH - (float)s.Height) / 2; break;
                    }
                }
            }
            catch (Exception ex) { Log(ex); }
        }

        // ── Distribute ───────────────────────────────────────────────────────
        public void DistributeH() => DistributeShapes(msoDistributeHorizontally);
        public void DistributeV() => DistributeShapes(msoDistributeVertically);

        private void DistributeShapes(int distType)
        {
            if (!Connect()) return;
            try
            {
                var shapes = GetShapes();
                if (shapes == null || shapes.Count < 3) return;
                shapes.Distribute(distType, msoFalse);
            }
            catch (Exception ex) { Log(ex); }
        }

        // ── Same Size ────────────────────────────────────────────────────────
        public void SameWidth()
        {
            if (!Connect()) return;
            try
            {
                var shapes = GetShapes();
                if (shapes == null || shapes.Count < 2) return;
                float w = (float)shapes[1].Width;
                for (int i = 2; i <= shapes.Count; i++) shapes[i].Width = w;
            }
            catch (Exception ex) { Log(ex); }
        }

        public void SameHeight()
        {
            if (!Connect()) return;
            try
            {
                var shapes = GetShapes();
                if (shapes == null || shapes.Count < 2) return;
                float h = (float)shapes[1].Height;
                for (int i = 2; i <= shapes.Count; i++) shapes[i].Height = h;
            }
            catch (Exception ex) { Log(ex); }
        }

        public void SameSize()
        {
            if (!Connect()) return;
            try
            {
                var shapes = GetShapes();
                if (shapes == null || shapes.Count < 2) return;
                float w = (float)shapes[1].Width;
                float h = (float)shapes[1].Height;
                for (int i = 2; i <= shapes.Count; i++)
                {
                    shapes[i].Width  = w;
                    shapes[i].Height = h;
                }
            }
            catch (Exception ex) { Log(ex); }
        }

        // ── Swap ─────────────────────────────────────────────────────────────
        public void SwapShapes()
        {
            if (!Connect()) return;
            try
            {
                var shapes = GetShapes();
                if (shapes == null || shapes.Count != 2) return;
                float t1 = (float)shapes[1].Top,  l1 = (float)shapes[1].Left;
                shapes[1].Top  = shapes[2].Top;
                shapes[1].Left = shapes[2].Left;
                shapes[2].Top  = t1;
                shapes[2].Left = l1;
            }
            catch (Exception ex) { Log(ex); }
        }

        // ── Group / Ungroup ──────────────────────────────────────────────────
        public void Group()
        {
            if (!Connect()) return;
            try { GetShapes()?.Group(); }
            catch (Exception ex) { Log(ex); }
        }

        public void Ungroup()
        {
            if (!Connect()) return;
            try { GetShapes()?.Ungroup(); }
            catch (Exception ex) { Log(ex); }
        }

        // ── Insert Shapes ────────────────────────────────────────────────────
        public void AddRectangle() => AddShape(msoShapeRectangle);
        public void AddCircle()    => AddShape(msoShapeOval);
        public void AddTriangle()  => AddShape(7 /* msoShapeIsoscelesTriangle */);

        private void AddShape(int shapeType)
        {
            if (!Connect()) return;
            try
            {
                var slide = GetSlide();
                if (slide == null) return;
                // Get slide dimensions for centring
                float sw = (float)_app.ActivePresentation.PageSetup.SlideWidth;
                float sh = (float)_app.ActivePresentation.PageSetup.SlideHeight;
                float w = 180, h = 120;
                slide.Shapes.AddShape(shapeType, (sw - w) / 2, (sh - h) / 2, w, h);
            }
            catch (Exception ex) { Log(ex); }
        }

        public void AddTextBox()
        {
            if (!Connect()) return;
            try
            {
                var slide = GetSlide();
                if (slide == null) return;
                float sw = (float)_app.ActivePresentation.PageSetup.SlideWidth;
                float sh = (float)_app.ActivePresentation.PageSetup.SlideHeight;
                float w = 200, h = 50;
                var tb = slide.Shapes.AddTextbox(1 /*msoTextOrientationHorizontal*/,
                    (sw - w) / 2, (sh - h) / 2, w, h);
                var tr = tb.TextFrame.TextRange;
                tr.Text = "Text";
                tr.Select();
            }
            catch (Exception ex) { Log(ex); }
        }

        public void AddLine()
        {
            if (!Connect()) return;
            try
            {
                var slide = GetSlide();
                if (slide == null) return;
                float sw = (float)_app.ActivePresentation.PageSetup.SlideWidth;
                float sh = (float)_app.ActivePresentation.PageSetup.SlideHeight;
                slide.Shapes.AddLine(sw / 2 - 100, sh / 2, sw / 2 + 100, sh / 2);
            }
            catch (Exception ex) { Log(ex); }
        }

        public void AddArrow()
        {
            if (!Connect()) return;
            try
            {
                var slide = GetSlide();
                if (slide == null) return;
                float sw = (float)_app.ActivePresentation.PageSetup.SlideWidth;
                float sh = (float)_app.ActivePresentation.PageSetup.SlideHeight;
                var line = slide.Shapes.AddLine(sw / 2 - 100, sh / 2, sw / 2 + 100, sh / 2);
                // ppArrowheadOpen = 2, ppArrowheadWidthMedium = 2, ppArrowheadLengthMedium = 2
                line.Line.EndArrowheadStyle  = 2;
                line.Line.EndArrowheadWidth  = 2;
                line.Line.EndArrowheadLength = 2;
            }
            catch (Exception ex) { Log(ex); }
        }



        // ── Align Matrix ─────────────────────────────────────────────────────
        public void AlignMatrix()
        {
            if (!Connect()) return;
            try
            {
                var shapes = GetShapes();
                if (shapes == null || shapes.Count < 2) return;

                int count = shapes.Count;
                int cols = (int)Math.Ceiling(Math.Sqrt(count));
                int rowsCount = (int)Math.Ceiling((double)count / cols);

                var list = new List<dynamic>();
                for (int i = 1; i <= count; i++) list.Add(shapes[i]);

                // Sort: Top-most, then Left-most
                list.Sort((a, b) => {
                    float t1 = (float)a.Top, t2 = (float)b.Top;
                    if (Math.Abs(t1 - t2) > 5) return t1.CompareTo(t2);
                    return ((float)a.Left).CompareTo((float)b.Left);
                });

                float w = (float)list[0].Width;
                float h = (float)list[0].Height;
                float gap = 20;

                // Calculate total size of the matrix
                float totalW = cols * w + (cols - 1) * gap;
                float totalH = rowsCount * h + (rowsCount - 1) * gap;

                // Centering on slide
                float sw = (float)_app.ActivePresentation.PageSetup.SlideWidth;
                float sh = (float)_app.ActivePresentation.PageSetup.SlideHeight;
                float startL = (sw - totalW) / 2;
                float startT = (sh - totalH) / 2;

                for (int i = 0; i < count; i++)
                {
                    int r = i / cols;
                    int c = i % cols;
                    list[i].Left = startL + c * (w + gap);
                    list[i].Top  = startT + r * (h + gap);
                }
            }
            catch (Exception ex) { Log(ex); }
        }

        // ── Style & Text ─────────────────────────────────────────────────────
        public void MatchStyle()
        {
            if (!Connect()) return;
            try
            {
                var shapes = GetShapes();
                if (shapes == null || shapes.Count < 2) return;

                // Pick up style from the first shape and apply to others
                shapes[1].PickUp();
                for (int i = 2; i <= shapes.Count; i++)
                {
                    shapes[i].Apply();
                }
            }
            catch (Exception ex) { Log(ex); }
        }

        public void AutoFit()
        {
            if (!Connect()) return;
            try
            {
                var shapes = GetShapes();
                if (shapes == null) return;

                foreach (dynamic shape in shapes)
                {
                    if (shape.HasTextFrame == -1) // msoTrue
                    {
                        // msoAutoSizeShapeToFitText = 1
                        shape.TextFrame.AutoSize = 1;
                    }
                }
            }
            catch (Exception ex) { Log(ex); }
        }

        public void EncloseIcon()
        {
            if (!Connect()) return;
            try
            {
                var shapes = GetShapes();
                if (shapes == null || shapes.Count == 0) return;

                var slide = GetSlide();
                if (slide == null) return;

                var list = new List<dynamic>();
                for (int i = 1; i <= shapes.Count; i++) list.Add(shapes[i]);

                foreach (var s in list)
                {
                    float w = (float)s.Width;
                    float h = (float)s.Height;
                    float cx = (float)s.Left + w / 2;
                    float cy = (float)s.Top + h / 2;

                    float diam = Math.Max(w, h) * 1.3f; // Better subtle padding

                    var circle = slide.Shapes.AddShape(9, cx - diam / 2, cy - diam / 2, diam, diam); // 9 = msoShapeOval
                    
                    // Transparent center, solid border using presentation's default theme color
                    circle.Fill.Visible = 0; // msoFalse
                    circle.Line.Visible = -1; // msoTrue
                    circle.Line.Weight = 1.5f;
                    
                    circle.ZOrder(1); // msoSendToBack
                    
                    s.Left = cx - w / 2;
                    s.Top = cy - h / 2;

                    // Group them together
                    try
                    {
                        var group = slide.Shapes.Range(new string[] { s.Name, circle.Name }).Group();
                        group.Select();
                    }
                    catch { } // Ignores grouping errors if types are not groupable
                }
            }
            catch (Exception ex) { Log(ex); }
        }

        // ── AI Integration ────────────────────────────────────────────────────
        public void ExpandText()
        {
            if (!Connect()) return;
            try
            {
                var shapes = GetShapes();
                if (shapes == null) return;

                foreach (dynamic shape in shapes)
                {
                    if (shape.HasTextFrame == -1) // msoTrue
                    {
                        var textRange = shape.TextFrame.TextRange;
                        string original = textRange.Text;
                        if (string.IsNullOrWhiteSpace(original)) continue;

                        // Call AI (Simulated)
                        string expanded = original + " [AI Enhanced: This point has been professionally expanded for clarity.]";
                        textRange.Text = expanded;
                    }
                }
            }
            catch (Exception ex) { Log(ex); }
        }

        // ── Smart Row / Column ───────────────────────────────────────────────
        public void AddRow()
        {
            if (!Connect()) return;
            try
            {
                var shapes = GetShapes();
                if (shapes == null || shapes.Count < 1) return;

                // 1. Get Bounding Box
                float minT = float.MaxValue, maxB = float.MinValue;
                float minL = float.MaxValue, maxR = float.MinValue;
                var list = new List<dynamic>();
                for (int i = 1; i <= shapes.Count; i++) {
                    var s = shapes[i];
                    list.Add(s);
                    minT = Math.Min(minT, (float)s.Top);
                    maxB = Math.Max(maxB, (float)s.Top + (float)s.Height);
                    minL = Math.Min(minL, (float)s.Left);
                    maxR = Math.Max(maxR, (float)s.Left + (float)s.Width);
                }

                // 2. Identify Rows (tolerance 5px)
                var rows = list.GroupBy(s => Math.Round((float)s.Top / 5) * 5)
                               .OrderBy(g => g.Key).ToList();
                int rowCount = rows.Count;
                float totalH = maxB - minT;
                float newRowH = totalH / (rowCount + 1);
                float gap = 10; // vertical gap

                // 3. Duplicate Bottom Row
                var bottomRow = rows.Last().ToList();
                var newShapes = new List<dynamic>();
                foreach (var s in bottomRow) {
                    var copy = s.Duplicate();
                    // FIX: Reset Left position to match the original shape immediately.
                    // PowerPoint's Duplicate() offsets the shape horizontally by default.
                    copy.Left = s.Left;
                    newShapes.Add(copy);
                }

                // 4. Resize and Reposition all
                var allShapes = list.Concat(newShapes).ToList();
                var updatedRows = allShapes.GroupBy(s => Math.Round((float)s.Top / 5) * 5)
                                           .OrderBy(g => g.Key).ToList();

                float currentT = minT;
                float shapeH = (totalH - (updatedRows.Count - 1) * gap) / updatedRows.Count;

                foreach (var row in updatedRows) {
                    foreach (var s in row) {
                        s.Top = currentT;
                        s.Height = shapeH;
                    }
                    currentT += shapeH + gap;
                }
            }
            catch (Exception ex) { Log(ex); }
        }

        public void AddColumn()
        {
            if (!Connect()) return;
            try
            {
                var shapes = GetShapes();
                if (shapes == null || shapes.Count < 1) return;

                // 1. Bounding Box
                float minL = float.MaxValue, maxR = float.MinValue;
                float minT = float.MaxValue, maxB = float.MinValue;
                var list = new List<dynamic>();
                for (int i = 1; i <= shapes.Count; i++) {
                    var s = shapes[i];
                    list.Add(s);
                    minL = Math.Min(minL, (float)s.Left);
                    maxR = Math.Max(maxR, (float)s.Left + (float)s.Width);
                    minT = Math.Min(minT, (float)s.Top);
                    maxB = Math.Max(maxB, (float)s.Top + (float)s.Height);
                }

                // 2. Identify Columns
                var cols = list.GroupBy(s => Math.Round((float)s.Left / 5) * 5)
                               .OrderBy(g => g.Key).ToList();
                int colCount = cols.Count;
                float totalW = maxR - minL;
                float gap = 10;

                // 3. Duplicate Rightmost Column
                var rightCol = cols.Last().ToList();
                var newShapes = new List<dynamic>();
                foreach (var s in rightCol) {
                    var copy = s.Duplicate();
                    // FIX: Reset Top position to match the original shape immediately.
                    // PowerPoint's Duplicate() offsets the shape vertically by default.
                    copy.Top = s.Top; 
                    newShapes.Add(copy);
                }

                // 4. Resize and Reposition
                var allShapes = list.Concat(newShapes).ToList();
                var updatedCols = allShapes.GroupBy(s => Math.Round((float)s.Left / 5) * 5)
                                           .OrderBy(g => g.Key).ToList();

                float currentL = minL;
                float shapeW = (totalW - (updatedCols.Count - 1) * gap) / updatedCols.Count;

                foreach (var col in updatedCols) {
                    foreach (var s in col) {
                        s.Left = currentL;
                        s.Width = shapeW;
                    }
                    currentL += shapeW + gap;
                }
            }
            catch (Exception ex) { Log(ex); }
        }

        // ── Translation & RTL ────────────────────────────────────────────────
        private IEnumerable<dynamic> GetAllShapes(dynamic shapes)
        {
            var result = new List<dynamic>();
            try
            {
                foreach (dynamic shape in shapes)
                {
                    result.Add(shape);
                    // Check if it's a group (msoGroup = 6)
                    try
                    {
                        if (shape.Type == 6)
                        {
                            result.AddRange(GetAllShapes(shape.GroupItems));
                        }
                    }
                    catch { /* Might fail on certain COM objects */ }
                }
            }
            catch { }
            return result;
        }

        public string GetSlideText()
        {
            if (!Connect()) return "{}";
            try
            {
                var slide = GetSlide();
                if (slide == null) return "{}";

                var textData = new Dictionary<string, string>();
                var allShapes = GetAllShapes(slide.Shapes);

                foreach (dynamic shape in allShapes)
                {
                    try
                    {
                        var textFrame = shape.HasTextFrame == -1 ? shape.TextFrame : null;
                        if (textFrame != null && textFrame.HasText == -1)
                        {
                            string text = textFrame.TextRange.Text;
                            if (!string.IsNullOrWhiteSpace(text))
                            {
                                textData[shape.Name] = text;
                            }
                        }
                    }
                    catch { /* Some shapes might error on property access */ }
                }
                
                string json = new JavaScriptSerializer().Serialize(textData);
                System.Diagnostics.Debug.WriteLine("[PPT] Extracted: " + json);
                return json;
            }
            catch (Exception ex) { Log(ex); return "{}"; }
        }

        public void ApplyTranslation(string jsonTranslation)
        {
            if (!Connect()) return;
            try
            {
                var slide = GetSlide();
                if (slide == null) return;

                // Robust JSON parser from the framework
                var dict = new JavaScriptSerializer().Deserialize<Dictionary<string, string>>(jsonTranslation);
                if (dict == null) return;
                
                var allShapes = GetAllShapes(slide.Shapes);
                float slideWidth = (float)_app.ActivePresentation.PageSetup.SlideWidth;

                foreach (dynamic shape in allShapes)
                {
                    try
                    {
                        // 1. If text exists, update and format it
                        if (dict.TryGetValue(shape.Name, out string translatedText))
                        {
                            var textFrame = shape.HasTextFrame == -1 ? shape.TextFrame : null;
                            if (textFrame != null)
                            {
                                var textRange = textFrame.TextRange;
                                textRange.Text = translatedText;
                                
                                // Change font to Calibri (clean, universal)
                                textRange.Font.NameAscii = "Calibri";
                                textRange.Font.NameFarEast = "Calibri";
                                textRange.Font.NameOther = "Calibri";
                                textRange.Font.NameComplexScript = "Calibri";
                                
                                // Set language ID for spellcheck etc, but don't force RTL alignment
                                try { textRange.LanguageID = 1025; } catch { }
                            }
                        }
                    }
                    catch { }
                }

                // Layout and Alignment are preserved exactly as in the original slide
            }
            catch (Exception ex) { Log(ex); }
        }

        // ── New AI Helpers ───────────────────────────────────────────────────

        private dynamic GetActiveShapeRange(dynamic sel)
        {
            try
            {
                if (sel.HasChildShapeRange) return sel.ChildShapeRange;
            }
            catch { }
            return sel.ShapeRange;
        }

        public string GetSelectedText()
        {
            if (!Connect()) return "";
            try
            {
                var sel = _app.ActiveWindow.Selection;
                if ((int)sel.Type == 3) // Text
                {
                    string text = sel.TextRange.Text;
                    if (string.IsNullOrWhiteSpace(text)) 
                    {
                        try { return GetActiveShapeRange(sel)[1].TextFrame.TextRange.Text; }
                        catch { return sel.TextRange.Parent.Parent.TextFrame.TextRange.Text; }
                    }
                    return text;
                }
                else if ((int)sel.Type == 2) // Shape(s)
                {
                    var shapes = GetActiveShapeRange(sel);
                    if (shapes.Count > 0 && shapes[1].HasTextFrame == -1) // msoTrue
                    {
                        return shapes[1].TextFrame.TextRange.Text;
                    }
                }
                return "";
            }
            catch (Exception ex) { Log(ex); return ""; }
        }

        public void ReplaceSelectedText(string newText, bool asBullets = false)
        {
            if (!Connect()) return;
            try
            {
                var sel = _app.ActiveWindow.Selection;
                if ((int)sel.Type == 3) // Text
                {
                    string text = sel.TextRange.Text;
                    if (string.IsNullOrWhiteSpace(text)) 
                    {
                        try { ApplyTextWithBold(GetActiveShapeRange(sel)[1].TextFrame.TextRange, newText, asBullets); }
                        catch { ApplyTextWithBold(sel.TextRange.Parent.Parent.TextFrame.TextRange, newText, asBullets); }
                    }
                    else
                    {
                        ApplyTextWithBold(sel.TextRange, newText, asBullets);
                    }
                }
                else if ((int)sel.Type == 2) // Shape(s)
                {
                    var shapes = GetActiveShapeRange(sel);
                    if (shapes.Count > 0 && shapes[1].HasTextFrame == -1) // msoTrue
                    {
                        ApplyTextWithBold(shapes[1].TextFrame.TextRange, newText, asBullets);
                    }
                }
            }
            catch (Exception ex) { Log(ex); }
        }

        private void ApplyTextWithBold(dynamic targetTextRange, string markdownText, bool asBullets = false)
        {
            markdownText = markdownText.Replace("\r\n", "\r").Replace("\n", "\r");
            var parts = markdownText.Split(new[] { "**" }, StringSplitOptions.None);
            string plainText = "";
            var boldRanges = new List<Tuple<int, int>>();
            
            for (int i = 0; i < parts.Length; i++)
            {
                if (i % 2 == 1) 
                {
                    boldRanges.Add(Tuple.Create(plainText.Length, parts[i].Length));
                }
                plainText += parts[i];
            }

            targetTextRange.Text = plainText;
            
            foreach (var r in boldRanges)
            {
                if (r.Item2 > 0)
                {
                    var boldPtr = targetTextRange.Characters(r.Item1 + 1, r.Item2);
                    boldPtr.Font.Bold = -1; // msoTrue
                }
            }

            if (asBullets)
            {
                try 
                { 
                    targetTextRange.ParagraphFormat.Bullet.Type = 1; // msoBulletUnnumbered
                    targetTextRange.ParagraphFormat.Bullet.Visible = -1; 
                } 
                catch { }
            }
        }

        public void InsertLeadSentence(string text)
        {
            if (!Connect()) return;
            try
            {
                var slide = GetSlide();
                if (slide == null) return;
                
                // Add a text box below a typical title (Left: 30, Top: 80, Width: 800, Height: 30)
                var shape = slide.Shapes.AddTextbox(1, 40, 75, 800, 30); // 1 = msoTextOrientationHorizontal
                var tr = shape.TextFrame.TextRange;
                tr.Text = text;
                
                // Premium styling (Bold, Calibri, Slate color)
                tr.Font.NameAscii = "Calibri";
                tr.Font.NameFarEast = "Calibri";
                tr.Font.NameOther = "Calibri";
                tr.Font.Size = 18;
                tr.Font.Bold = -1; // msoTrue
                // Colors in Office are BGR. Black is 0x000000
                tr.Font.Color.RGB = 0x000000; 
            }
            catch (Exception ex) { Log(ex); }
        }

        // ── AI Agent: Slide Creation ──────────────────────────────────────────

        /// <summary>Creates a new blank slide at the end of the presentation.</summary>
        public int CreateNewSlide()
        {
            if (!Connect()) return -1;
            try
            {
                var pres = _app.ActivePresentation;
                int count = pres.Slides.Count;
                // ppLayoutBlank = 12
                var slide = pres.Slides.Add(count + 1, 12);
                _app.ActiveWindow.View.GotoSlide(slide.SlideIndex);
                return slide.SlideIndex;
            }
            catch (Exception ex) { Log(ex); return -1; }
        }

        /// <summary>
        /// Creates a new slide from a generic JSON config generated by AI.
        /// JSON format:
        /// {
        ///   "shapes": [
        ///     {
        ///       "type": "textbox" | "rect" | "circle" | "triangle" | "line",
        ///       "x": 0, "y": 0, "w": 0, "h": 0,
        ///       "text": "...", "fontSize": 14, "fontColor": "#333333", "bold": false, "align": "left|center|right",
        ///       "fill": "#hex" (for shapes), "lineColor": "#hex" (optional)
        ///     }
        ///   ]
        /// }
        /// </summary>
        public string CreateSlideFromJson(string json)
        {
            if (!Connect()) return "ERROR:Not connected to PowerPoint";
            try
            {
                var ser = new JavaScriptSerializer();
                var data = ser.Deserialize<Dictionary<string, object>>(json);
                if (data == null || !data.ContainsKey("shapes")) return "ERROR:Invalid JSON or missing 'shapes' array";

                var pres = _app.ActivePresentation;
                int count = pres.Slides.Count;

                // Always add a blank slide, the AI defines all content via shapes
                var slide = pres.Slides.Add(count + 1, 12); // ppLayoutBlank = 12
                
                // Navigate to the new slide INSTANTLY so the user sees it while shapes are being built
                _app.ActiveWindow.View.GotoSlide(slide.SlideIndex);

                var shapesObj = data["shapes"];
                System.Collections.IList shapesList = null;

                if (shapesObj is System.Collections.ArrayList al) shapesList = al;
                else if (shapesObj is object[] oa) shapesList = oa;

                if (shapesList != null)
                {
                    BuildShapesOnSlide(slide, shapesList);
                }

                return "OK:Slide " + slide.SlideIndex + " created successfully";
            }
            catch (Exception ex) { Log(ex); return "ERROR:" + ex.Message; }
        }

        /// <summary>
        /// Edits the current slide in-place by clearing all existing shapes and rebuilding from JSON.
        /// </summary>
        public string EditCurrentSlideFromJson(string json)
        {
            if (!Connect()) return "ERROR:Not connected to PowerPoint";
            try
            {
                var ser = new JavaScriptSerializer();
                var data = ser.Deserialize<Dictionary<string, object>>(json);
                if (data == null || !data.ContainsKey("shapes")) return "ERROR:Invalid JSON or missing 'shapes' array";

                var slide = GetSlide();
                if (slide == null) return "ERROR:No active slide to edit";

                // Delete all existing shapes from the current slide (in reverse order to avoid index shifting)
                int shapeCount = slide.Shapes.Count;
                for (int i = shapeCount; i >= 1; i--)
                {
                    try { slide.Shapes[i].Delete(); } catch { }
                }

                // Now rebuild the slide with the new shapes
                var shapesObj = data["shapes"];
                System.Collections.IList shapesList = null;

                if (shapesObj is System.Collections.ArrayList al) shapesList = al;
                else if (shapesObj is object[] oa) shapesList = oa;

                if (shapesList != null)
                {
                    BuildShapesOnSlide(slide, shapesList);
                }

                return "OK:Slide " + slide.SlideIndex + " updated successfully";
            }
            catch (Exception ex) { Log(ex); return "ERROR:" + ex.Message; }
        }

        /// <summary>
        /// Shared helper: builds shapes on a given slide from a shapes list.
        /// Used by both CreateSlideFromJson and EditCurrentSlideFromJson.
        /// </summary>
        private void BuildShapesOnSlide(dynamic slide, System.Collections.IList shapesList)
        {
            foreach (var sObj in shapesList)
            {
                var sDict = sObj as Dictionary<string, object>;
                if (sDict == null) continue;

                string type = sDict.ContainsKey("type") ? sDict["type"].ToString().ToLower() : "rect";
                float x = sDict.ContainsKey("x") ? Convert.ToSingle(sDict["x"]) : 100;
                float y = sDict.ContainsKey("y") ? Convert.ToSingle(sDict["y"]) : 100;
                float w = sDict.ContainsKey("w") ? Convert.ToSingle(sDict["w"]) : 150;
                float h = sDict.ContainsKey("h") ? Convert.ToSingle(sDict["h"]) : 50;

                dynamic newShape;

                if (type == "textbox")
                {
                    newShape = slide.Shapes.AddTextbox(1, x, y, w, h);
                    newShape.TextFrame.AutoSize = 0;
                    newShape.TextFrame.WordWrap = -1;
                }
                else if (type == "line")
                {
                    newShape = slide.Shapes.AddLine(x, y, x + w, y + h);
                }
                else if (type == "icon")
                {
                    string query = sDict.ContainsKey("query") ? sDict["query"].ToString() : "settings";
                    string iconQuery = query.Replace(" ", "-").ToLower();
                    string url = $"https://img.icons8.com/ios/100/0d1b3e/{iconQuery}.png";

                    try
                    {
                        string tempDir = System.IO.Path.GetTempPath();
                        string tempFile = System.IO.Path.Combine(tempDir, $"conslide_{Guid.NewGuid()}.png");

                        using (var client = new WebClient())
                        {
                            client.Headers.Add("User-Agent", "Conslide/1.0");
                            client.DownloadFile(url, tempFile);
                        }

                        if (new System.IO.FileInfo(tempFile).Length > 100)
                        {
                            newShape = slide.Shapes.AddPicture(tempFile, 0, -1, x, y, w, h);
                            newShape.LockAspectRatio = 0;
                        }
                        else
                        {
                            throw new Exception("Icon download failed");
                        }

                        try { System.IO.File.Delete(tempFile); } catch { }
                    }
                    catch
                    {
                        newShape = slide.Shapes.AddShape(1, x, y, w, h);
                        newShape.Line.Visible = 0;
                        newShape.Fill.ForeColor.RGB = HexToRgb("#f0f4ff");
                    }
                    continue;
                }
                else
                {
                    int shapeType = 1;
                    if (type == "circle") shapeType = 9;
                    else if (type == "triangle") shapeType = 7;
                    else if (type == "rounded_rect") shapeType = 5;
                    else if (type == "arrow") shapeType = 33;
                    else if (type == "chevron") shapeType = 52;
                    else if (type == "pentagon") shapeType = 51;
                    else if (type == "hexagon") shapeType = 10;
                    else if (type == "notched_arrow") shapeType = 50;

                    newShape = slide.Shapes.AddShape(shapeType, x, y, w, h);

                    if (sDict.ContainsKey("lineColor"))
                    {
                        newShape.Line.Visible = -1;
                        newShape.Line.ForeColor.RGB = HexToRgb(sDict["lineColor"].ToString());
                        newShape.Line.Weight = sDict.ContainsKey("lineWeight") ? Convert.ToSingle(sDict["lineWeight"]) : 1f;
                    }
                    else
                    {
                        newShape.Line.Visible = 0;
                    }

                    if (shapeType == 5)
                    {
                        try
                        {
                            float roundness = sDict.ContainsKey("roundness") ? Convert.ToSingle(sDict["roundness"]) : 0.08f;
                            newShape.Adjustments[1] = roundness;
                        }
                        catch { }
                    }
                }

                // Text
                if (type != "line" && sDict.ContainsKey("text") && sDict["text"] != null)
                {
                    string rawText = "";
                    if (sDict["text"] is System.Collections.ArrayList arr)
                    {
                        var parts = new List<string>();
                        foreach (var item in arr) parts.Add(item?.ToString()
                            .Replace("<br>", "\r").Replace("<br/>", "\r").Replace("<br />", "\r")
                            .Replace("&nbsp;", " ")
                            .Replace("\\n", "\r").Replace("\n", "\r"));
                        rawText = string.Join("\r", parts);
                    }
                    else
                    {
                        rawText = sDict["text"].ToString()
                            .Replace("<br>", "\r").Replace("<br/>", "\r").Replace("<br />", "\r")
                            .Replace("&nbsp;", " ")
                            .Replace("\\n", "\r").Replace("\n", "\r");
                    }

                    if (!string.IsNullOrWhiteSpace(rawText))
                    {
                        var textRange = newShape.TextFrame.TextRange;
                        ApplyTextWithBold(textRange, rawText, false);

                        int fontSize = sDict.ContainsKey("fontSize") ? Convert.ToInt32(sDict["fontSize"]) : (type == "textbox" ? 14 : 12);
                        textRange.Font.Size = fontSize;
                        string fontName = sDict.ContainsKey("fontName") ? sDict["fontName"].ToString() : "Aptos (Body)";
                        textRange.Font.NameAscii = fontName;
                        textRange.Font.NameFarEast = fontName;
                        textRange.Font.NameOther = fontName;

                        if (sDict.ContainsKey("bold") && Convert.ToBoolean(sDict["bold"]))
                            textRange.Font.Bold = -1;

                        if (sDict.ContainsKey("fontColor"))
                        {
                            int rgb = HexToRgb(sDict["fontColor"].ToString());
                            textRange.Font.Color.RGB = rgb;
                        }
                        else if (type != "textbox")
                        {
                            textRange.Font.Color.RGB = 0xFFFFFF;
                        }
                        else
                        {
                            textRange.Font.Color.RGB = 0x333333;
                        }

                        if (sDict.ContainsKey("align"))
                        {
                            string align = sDict["align"].ToString().ToLower();
                            if (align == "center") textRange.ParagraphFormat.Alignment = 2;
                            else if (align == "right") textRange.ParagraphFormat.Alignment = 3;
                            else textRange.ParagraphFormat.Alignment = 1;
                        }
                        else if (type != "textbox")
                        {
                            textRange.ParagraphFormat.Alignment = 2;
                        }

                        if (sDict.ContainsKey("isBullets") && Convert.ToBoolean(sDict["isBullets"]))
                        {
                            textRange.ParagraphFormat.Bullet.Type = 1;
                            textRange.ParagraphFormat.Bullet.Visible = -1;
                        }
                    }
                }

                // Fill color
                if (type != "textbox" && type != "line" && sDict.ContainsKey("fill"))
                {
                    newShape.Fill.ForeColor.RGB = HexToRgb(sDict["fill"].ToString());
                }

                // Line color
                if (sDict.ContainsKey("lineColor"))
                {
                    newShape.Line.Visible = -1;
                    newShape.Line.ForeColor.RGB = HexToRgb(sDict["lineColor"].ToString());
                }
            }
        }

        private int HexToRgb(string hex)
        {
            hex = hex.TrimStart('#');
            if (hex.Length != 6) return 0;
            try
            {
                int r = Convert.ToInt32(hex.Substring(0, 2), 16);
                int g = Convert.ToInt32(hex.Substring(2, 2), 16);
                int b = Convert.ToInt32(hex.Substring(4, 2), 16);
                return r | (g << 8) | (b << 16);
            }
            catch { return 0; }
        }

        private string RgbToHex(int rgb)
        {
            int r = rgb & 0xFF;
            int g = (rgb >> 8) & 0xFF;
            int b = (rgb >> 16) & 0xFF;
            return $"#{r:x2}{g:x2}{b:x2}";
        }

        public string GetCurrentSlideAsJson()
        {
            if (!Connect()) return "{}";
            try
            {
                var slide = GetSlide();
                if (slide == null) return "{}";

                var shapesList = new List<Dictionary<string, object>>();

                foreach (dynamic shape in slide.Shapes)
                {
                    var sDict = new Dictionary<string, object>();
                    try { sDict["x"] = Math.Round((double)shape.Left); } catch {}
                    try { sDict["y"] = Math.Round((double)shape.Top); } catch {}
                    try { sDict["w"] = Math.Round((double)shape.Width); } catch {}
                    try { sDict["h"] = Math.Round((double)shape.Height); } catch {}

                    int msoType = -1;
                    try { msoType = shape.Type; } catch {}
                    
                    int autoShapeType = -1;
                    try { autoShapeType = shape.AutoShapeType; } catch {}

                    string typeStr = "rect";

                    if (msoType == 17) typeStr = "textbox"; // msoTextBox
                    else if (msoType == 9) typeStr = "line"; // msoLine
                    else if (msoType == 13) typeStr = "icon"; // msoPicture
                    else if (msoType == 1) // msoAutoShape
                    {
                        if (autoShapeType == 9) typeStr = "circle"; // msoShapeOval
                        else if (autoShapeType == 7) typeStr = "triangle"; // msoShapeIsoscelesTriangle
                        else if (autoShapeType == 5) typeStr = "rounded_rect"; // msoShapeRoundedRectangle
                        else if (autoShapeType == 33) typeStr = "arrow";
                        else if (autoShapeType == 52) typeStr = "chevron";
                        else if (autoShapeType == 51) typeStr = "pentagon";
                        else if (autoShapeType == 10) typeStr = "hexagon";
                        else if (autoShapeType == 50) typeStr = "notched_arrow";
                    }

                    sDict["type"] = typeStr;

                    try
                    {
                        if (shape.HasTextFrame == -1 && shape.TextFrame.HasText == -1)
                        {
                            sDict["text"] = shape.TextFrame.TextRange.Text.Replace("\r", "\n");
                            sDict["fontSize"] = Math.Round((double)shape.TextFrame.TextRange.Font.Size);
                            sDict["fontColor"] = RgbToHex((int)shape.TextFrame.TextRange.Font.Color.RGB);
                            sDict["fontName"] = shape.TextFrame.TextRange.Font.Name;
                            sDict["bold"] = shape.TextFrame.TextRange.Font.Bold == -1;
                            
                            int align = shape.TextFrame.TextRange.ParagraphFormat.Alignment;
                            if (align == 2) sDict["align"] = "center";
                            else if (align == 3) sDict["align"] = "right";
                            else sDict["align"] = "left";
                            
                            sDict["isBullets"] = shape.TextFrame.TextRange.ParagraphFormat.Bullet.Visible == -1;
                        }
                    }
                    catch {}

                    try
                    {
                        if (typeStr != "textbox" && typeStr != "line" && typeStr != "icon")
                        {
                            if (shape.Fill.Visible == -1)
                            {
                                sDict["fill"] = RgbToHex((int)shape.Fill.ForeColor.RGB);
                            }
                        }
                    }
                    catch {}

                    try
                    {
                        if (shape.Line.Visible == -1)
                        {
                            sDict["lineColor"] = RgbToHex((int)shape.Line.ForeColor.RGB);
                            sDict["lineWeight"] = Math.Round((double)shape.Line.Weight, 1);
                        }
                    }
                    catch {}

                    shapesList.Add(sDict);
                }

                var result = new Dictionary<string, object> { { "shapes", shapesList } };
                var ser = new JavaScriptSerializer();
                return ser.Serialize(result);
            }
            catch (Exception ex)
            {
                Log(ex);
                return "{}";
            }
        }

        /// <summary>Gets slide count for chatbot context.</summary>
        public int GetSlideCount()
        {
            if (!Connect()) return 0;
            try { return _app.ActivePresentation.Slides.Count; }
            catch { return 0; }
        }

        /// <summary>Gets current slide index for chatbot context.</summary>
        public int GetCurrentSlideIndex()
        {
            if (!Connect()) return 0;
            try { return _app.ActiveWindow.View.Slide.SlideIndex; }
            catch { return 0; }
        }

        /// <summary>Duplicates the current slide.</summary>
        public string DuplicateCurrentSlide()
        {
            if (!Connect()) return "ERROR:Not connected";
            try
            {
                var slide = GetSlide();
                if (slide == null) return "ERROR:No active slide";
                var dup = slide.Duplicate();
                _app.ActiveWindow.View.GotoSlide(dup[1].SlideIndex);
                return "OK:Slide duplicated as slide " + dup[1].SlideIndex;
            }
            catch (Exception ex) { Log(ex); return "ERROR:" + ex.Message; }
        }

        private void Log(Exception ex)
        {
            System.Diagnostics.Debug.WriteLine("[PPT Error] " + ex.Message);
        }
    }
}