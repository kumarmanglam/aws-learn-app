// ============================================================
// SECTION: AI Fundamentals — ML & LLM Basics, Transformers,
// Tokens & Embeddings, Evaluation, Context/Memory, Inference.
// AI interview + practitioner fundamentals authored to the
// messaging.ts / frontend-core.ts bar.
// ============================================================
import { svgDefs, type Topic } from "./shared";

const box = (
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  sub: string,
  color = "#8b5cf6",
) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#243349" stroke="${color}"/>
  <text x="${x + w / 2}" y="${y + h / 2 - 2}" text-anchor="middle" fill="#e6edf3" font-size="12" font-weight="600">${title}</text>
  <text x="${x + w / 2}" y="${y + h / 2 + 15}" text-anchor="middle" fill="#8b949e" font-size="10">${sub}</text>
`;

export const aiFundamentalsTopics: Topic[] = [
  // -----------------------------------------------------------------
  {
    id: "ai-fundamentals",
    title: "ML & LLM Basics — Training, Loss & Generalization",
    shortLabel: "ML & LLM Basics",
    section: "AI Fundamentals",
    domain: "AI",
    tldr:
      "Machine learning means learning patterns from data instead of hand-coding rules. Every model trains in a loop: forward pass → loss (how wrong) → backward pass (gradients via backprop) → update weights (gradient descent). LLMs are self-supervised next-token predictors trained on trillions of tokens. Training updates weights and is expensive; inference freezes them and is fast. The real goal is generalization to unseen data — overfitting (memorized train, fails on test) is the enemy.",
    subtopics: [
      {
        heading: "What machine learning is",
        bullets: [
          { icon: "🧠", text: "**Learning patterns from data**, not explicit rules. Three paradigms: **supervised** (labeled input→output), **unsupervised** (find structure in unlabeled data), **reinforcement** (trial-and-error with rewards)." },
          { icon: "🔤", text: "LLMs use **self-supervised** learning — a special supervised case where labels come **from the data itself** (next-token prediction), so no human annotation is needed on trillion-token corpora." },
          { icon: "🎯", text: "**Generalization** — performing well on data never seen in training — is the whole point; memorizing the training set is not." },
        ],
      },
      {
        heading: "The training loop",
        bullets: [
          { icon: "➡️", text: "**Forward pass**: input → model → prediction; **loss** measures the error (cross-entropy for token/classification, MSE for regression)." },
          { icon: "⬅️", text: "**Backward pass (backpropagation)**: use the chain rule to compute the **gradient** of the loss w.r.t. every weight — which direction reduces error." },
          { icon: "📉", text: "**Gradient descent** nudges weights down the loss surface; the **learning rate** sets step size (too high = unstable, too low = slow)." },
        ],
      },
      {
        heading: "Training vs inference & the fit spectrum",
        bullets: [
          { icon: "💸", text: "**Training** updates weights, needs gradients, costs GPU-weeks. **Inference** freezes weights, just a forward pass, milliseconds. **Fine-tuning** = more training from a pretrained checkpoint." },
          { icon: "📚", text: "**Overfitting**: great on train, poor on test → add data, dropout, regularization, or a smaller model. **Underfitting**: poor even on train → bigger model / more training." },
          { icon: "✨", text: "**Emergent abilities** (chain-of-thought, in-context learning) appear abruptly past a scale threshold rather than gradually — a reason bigger models can qualitatively surprise." },
        ],
      },
    ],
    keyFacts: [
      { label: "Training loop", value: "forward → loss → backprop → update", icon: "🔁" },
      { label: "LLM objective", value: "Next-token (self-supervised)", icon: "🔤" },
      { label: "Overfitting sign", value: "High train, low test accuracy", icon: "📚" },
      { label: "Train vs inference", value: "Update weights vs frozen weights", icon: "💸" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'How does a model learn?' → **forward → loss → backprop → gradient descent**.",
        "'What is backprop?' → compute **gradient of loss per weight** via the chain rule.",
        "'Why do LLMs need no labels?' → **self-supervised** next-token prediction.",
        "'Great on train, bad on new data' → **overfitting** (regularize / more data).",
        "Training updates weights (expensive); **inference is a frozen forward pass**.",
      ],
      analogyBrief:
        "Training is a student doing a trillion practice problems with no textbook — after each one they adjust based on how wrong they were, until they can handle unseen questions.",
    },
    explanation:
      "Machine learning is the practice of learning patterns from data rather than being programmed with explicit rules, and it comes in three broad paradigms: supervised learning maps labeled inputs to outputs (image classifiers, and RLHF for LLMs), unsupervised learning discovers structure in unlabeled data (clustering, embeddings), and reinforcement learning improves through trial and error guided by rewards (AlphaGo, RLHF). Every model trains through the same loop: a forward pass turns inputs into predictions, a loss function quantifies how wrong those predictions are (cross-entropy for classification and for next-token prediction, mean-squared error for regression, contrastive losses for embeddings), a backward pass (backpropagation) uses the chain rule of calculus to compute the gradient of the loss with respect to each of the model's parameters, and an optimizer performs gradient descent, nudging each weight in the direction that reduces the loss by a step whose size is set by the learning rate. Large language models are trained with next-token prediction, a form of self-supervised learning: given 'The cat sat on the', the target 'mat' is taken directly from the corpus, so no human annotation is required and the model can learn grammar, facts, reasoning patterns, and code from trillions of tokens simply by learning to predict the next one. It is essential to separate training from inference: training updates the weights, requires gradients, and is expensive (GPU-weeks on large clusters), whereas inference freezes the weights and runs only the forward pass in milliseconds, and fine-tuning is simply further training that starts from a pretrained checkpoint. The central goal is generalization — performing well on data never seen during training — which is why we always measure quality on a held-out test set: high accuracy on the training data alone may just mean the model overfit (memorized the training data and fails on new inputs), which you combat with more data, dropout, weight decay, or a smaller model, while the opposite failure, underfitting, means the model is too weak to even fit the training data and needs more capacity or training. Finally, at sufficient scale certain capabilities appear to emerge discontinuously rather than improving smoothly, which is one reason larger models can behave qualitatively differently from smaller ones.",
    analogy:
      "Training a model is like teaching a student with a trillion practice problems but no textbook. After each problem the student sees how far off they were (the loss) and adjusts their approach in proportion to the mistake (the gradient), taking small steps so they do not overcorrect (the learning rate). Do this enough times and the student generalizes to brand-new questions they never studied. But a student who merely memorized the answer key (overfitting) aces the practice set and then fails a fresh exam — which is why the only fair test is questions they have never seen. Sitting the real exam later (inference) is quick and no learning happens; going back for extra tutoring on a new subject (fine-tuning) is more training, not the exam.",
    diagram: `<svg viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The training loop: forward pass, loss, backprop, weight update">${svgDefs}
      <text x="360" y="24" fill="#e6edf3" font-size="13" font-weight="700" text-anchor="middle">The Training Loop (repeat until loss converges)</text>
      ${box(30, 70, 130, 55, "Input data", "x, y pairs", "#8b949e")}
      ${box(210, 70, 130, 55, "Model", "forward pass", "#22c55e")}
      ${box(390, 70, 130, 55, "Loss", "how wrong?", "#f59e0b")}
      ${box(570, 70, 120, 55, "Backprop", "gradients", "#8b5cf6")}
      <line x1="160" y1="97" x2="208" y2="97" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="340" y1="97" x2="388" y2="97" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="520" y1="97" x2="568" y2="97" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <path d="M630 125 Q630 185 275 185 Q210 185 210 127" stroke="#f85149" stroke-width="1.6" stroke-dasharray="5 4" fill="none" marker-end="url(#arrow-mute)"/>
      <text x="360" y="178" fill="#f85149" font-size="11" text-anchor="middle">update weights (gradient descent)</text>
      ${box(60, 210, 170, 34, "Good: generalizes", "low train + test error", "#22c55e")}
      ${box(275, 210, 170, 34, "Overfit", "memorized train set", "#f85149")}
      ${box(490, 210, 170, 34, "Underfit", "too weak to learn", "#8b5cf6")}
    </svg>`,
    diagramLegend: [
      { color: "#22c55e", label: "Forward pass", description: "Model turns inputs into predictions; also the 'good fit' outcome." },
      { color: "#f59e0b", label: "Loss", description: "Measures prediction error (cross-entropy, MSE)." },
      { color: "#8b5cf6", label: "Backprop", description: "Chain-rule gradients tell each weight which way to move." },
    ],
    codeExample: {
      language: "python",
      title: "A minimal training loop (PyTorch-style)",
      code: `# The universal loop behind every trained model.
for batch in dataloader:
    optimizer.zero_grad()                    # clear old gradients
    predictions = model(batch.x)             # forward pass
    loss = criterion(predictions, batch.y)   # how wrong?
    loss.backward()                          # backprop: compute gradients
    optimizer.step()                         # gradient descent: update weights

# Training updates weights (expensive). Inference below is a frozen forward pass.
model.eval()
with torch.no_grad():                        # no gradients -> fast, cheap
    logits = model(new_input)`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Gradient descent",
        title: "Learn y = 2x + 1 by hand — gradient descent from scratch",
        code: `import numpy as np

np.random.seed(42)
X = np.random.randn(100)
y = 2 * X + 1 + np.random.randn(100) * 0.1   # true weights: w=2, b=1

w, b = 0.0, 0.0
lr = 0.1                                       # learning rate (step size)

for epoch in range(50):
    y_pred = w * X + b                         # forward pass
    loss = np.mean((y_pred - y) ** 2)          # MSE loss
    dw = np.mean(2 * (y_pred - y) * X)         # gradient wrt w (backward)
    db = np.mean(2 * (y_pred - y))             # gradient wrt b
    w -= lr * dw                               # update (gradient descent)
    b -= lr * db
    if epoch % 10 == 0:
        print(f"epoch {epoch:2d}: loss={loss:.4f}, w={w:.3f}, b={b:.3f}")

print(f"final: w={w:.3f} (true 2.0), b={b:.3f} (true 1.0)")
# The loss shrinks each epoch as w,b converge toward the true values.`,
      },
      {
        language: "python",
        tab: "Self-supervised",
        title: "Next-token prediction — where the LLM's labels come from",
        code: `# LLMs need no human labels: the label is just the next token in the text.
text = "The cat sat on the mat"
tokens = text.split()

# Each training example is (context so far) -> (next token)
for i in range(1, len(tokens)):
    context = tokens[:i]
    target = tokens[i]
    print(f"input={context!r:45} target={target!r}")

# input=['The']                                target='cat'
# input=['The', 'cat']                         target='sat'
# ...
# Cross-entropy loss measures how "surprised" the model was by the true target.
# Do this over trillions of tokens and grammar, facts, and reasoning emerge.`,
      },
      {
        language: "python",
        tab: "Over/underfit",
        title: "Spotting overfitting from the train/test gap",
        code: `train_acc = [0.72, 0.85, 0.93, 0.98, 0.999]
test_acc  = [0.70, 0.82, 0.86, 0.84, 0.78]   # starts dropping!

for epoch, (tr, te) in enumerate(zip(train_acc, test_acc)):
    gap = tr - te
    flag = "  <- overfitting (test falling, gap widening)" if gap > 0.1 else ""
    print(f"epoch {epoch}: train={tr:.3f} test={te:.3f} gap={gap:.3f}{flag}")

# A widening gap = memorization, not learning.
# Fixes: more data, dropout, weight decay, smaller model, early stopping.`,
      },
    ],
    problemStatement:
      "Your model reaches 99.9% accuracy on the training set but only 78% on a held-out test set, and the test accuracy is now dropping while training accuracy keeps climbing. Separately, a teammate insists that because the LLM you use required 'no labeled data', it must be unsupervised. Explain what is happening to the first model and three concrete fixes, and correct the teammate by describing exactly how next-token prediction produces its own labels.",
    questions: [
      {
        q: "What is the purpose of backpropagation?",
        options: [
          "A. To make predictions on brand-new data",
          "B. To compute the gradient of the loss with respect to each weight",
          "C. To load and shuffle the training dataset",
          "D. To split data into train and test sets",
        ],
        answer: "B",
        explanation:
          "B is correct: backprop applies the chain rule to compute how much each weight contributed to the error (its gradient), telling gradient descent which direction to move each parameter. Making predictions is the forward pass; loading/splitting data are separate steps.",
      },
      {
        q: "In the training loop, which sequence is correct?",
        options: [
          "A. Loss → forward pass → update → backprop",
          "B. Forward pass → loss → backprop → update weights",
          "C. Backprop → forward pass → loss → update",
          "D. Update weights → loss → forward pass → backprop",
        ],
        answer: "B",
        explanation:
          "B is correct: you first run the forward pass to get predictions, compute the loss, backpropagate to get gradients, then update the weights via the optimizer — repeated each batch.",
      },
      {
        q: "What distinguishes self-supervised learning (used by LLMs) from classic supervised learning?",
        options: [
          "A. Self-supervised learning uses no data at all",
          "B. Self-supervised learning creates its labels from the data itself (e.g. next-token prediction), needing no human annotation",
          "C. Self-supervised learning is always faster to run",
          "D. They are identical in every way",
        ],
        answer: "B",
        explanation:
          "B is correct: supervised learning needs human-labeled data, while self-supervised learning derives labels from the data's own structure — for an LLM the label for 'The cat sat on the' is simply 'mat', enabling training on trillion-token corpora with no annotation.",
      },
      {
        q: "A model scores 99% on training data but 75% on test data, and the gap is widening. What is happening, and a valid fix?",
        options: [
          "A. Underfitting — make the model bigger",
          "B. Overfitting — add more data, dropout, or regularization",
          "C. The learning rate is too low — increase it 100x",
          "D. Nothing is wrong; train accuracy is what matters",
        ],
        answer: "B",
        explanation:
          "B is correct: a high train / low (and falling) test score is classic overfitting — the model is memorizing rather than generalizing. Remedies include more data, dropout, weight decay, a smaller model, or early stopping. Test accuracy, not train accuracy, reflects real quality.",
      },
      {
        q: "Which statement about training vs inference is TRUE?",
        options: [
          "A. Inference updates the model's weights using gradients",
          "B. Training freezes weights while inference computes gradients",
          "C. Training updates weights and needs gradients; inference freezes weights and just runs the forward pass",
          "D. Fine-tuning is a type of inference",
        ],
        answer: "C",
        explanation:
          "C is correct: training updates weights and requires gradients (expensive), while inference is a frozen, gradient-free forward pass (fast). Fine-tuning is more training from a pretrained checkpoint, not inference.",
      },
      {
        q: "Why do some LLM capabilities appear as 'emergent abilities'?",
        options: [
          "A. They simply memorize more of the internet",
          "B. Certain capabilities appear abruptly once model scale crosses a threshold, rather than improving smoothly",
          "C. Larger models are always trained with better data by definition",
          "D. Emergence is purely a plotting artifact and never real",
        ],
        answer: "B",
        explanation:
          "B is correct: abilities like chain-of-thought reasoning and in-context learning can jump from near-zero to strong once scale passes a threshold, plausibly because several sub-skills must all reach sufficient quality at once. Memorization and data quality are separate factors.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "ai-transformers-attention",
    title: "Transformers & Attention — Q/K/V and Self-Attention",
    shortLabel: "Transformers & Attention",
    section: "AI Fundamentals",
    domain: "AI",
    tldr:
      "The Transformer replaced sequential RNNs with parallel self-attention. Each token is projected into a Query, Key, and Value; attention = softmax(QKᵀ/√dₖ)·V lets every token weigh how much to 'attend' to every other token. Multi-head attention runs several such lenses in parallel. A block is Attention → Add&Norm → Feed-Forward → Add&Norm, stacked dozens of times. Attention is O(n²) in sequence length (hence context limits), and it is permutation-invariant, so positional encodings (RoPE, ALiBi, sinusoidal) inject order.",
    subtopics: [
      {
        heading: "Why attention beat RNNs",
        bullets: [
          { icon: "🐌", text: "**RNNs** processed tokens one at a time — slow to train, and long-range dependencies **faded** across many steps." },
          { icon: "⚡", text: "**Self-attention** lets **any token attend to any other in parallel**, so the whole sequence trains at once and distant tokens connect directly." },
          { icon: "🧩", text: "This scalability + parallelism is why every major LLM (Claude, GPT, Llama, Gemini) is a Transformer." },
        ],
      },
      {
        heading: "Queries, Keys, Values",
        bullets: [
          { icon: "❓", text: "**Query** = 'what am I looking for?', **Key** = 'what do I offer?', **Value** = 'what I'll pass on.' A high Q·K dot product means high attention weight." },
          { icon: "📐", text: "`Attention(Q,K,V) = softmax(QKᵀ / √dₖ) · V` — score, scale by √dₖ (keeps softmax from getting too sharp), softmax to weights that sum to 1, then a weighted sum of Values." },
          { icon: "👓", text: "**Multi-head attention** runs several attention operations in parallel; each head learns a different relationship (syntax, coreference, position), then outputs are concatenated and projected." },
        ],
      },
      {
        heading: "The block, cost & position",
        bullets: [
          { icon: "🧱", text: "One layer = **Multi-Head Attention → Add&Norm (residual + layer norm) → Feed-Forward Network → Add&Norm**; the FFN stores most of the model's 'knowledge'. Models stack dozens of these." },
          { icon: "📈", text: "Attention is **O(n²)** in sequence length (every token attends to every other), which is exactly why context windows are limited and extending them is costly." },
          { icon: "🧭", text: "Raw attention is **permutation-invariant** (order-blind), so **positional encodings** — sinusoidal, **RoPE** (rotary), or **ALiBi** — inject where each token sits." },
        ],
      },
    ],
    keyFacts: [
      { label: "Core formula", value: "softmax(QKᵀ/√dₖ)·V", icon: "📐" },
      { label: "Attention cost", value: "O(n²) in sequence length", icon: "📈" },
      { label: "Multi-head", value: "Parallel lenses, each a relationship", icon: "👓" },
      { label: "Position info", value: "RoPE / ALiBi / sinusoidal", icon: "🧭" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'What is self-attention?' → each token weighs **every other token** by relevance.",
        "'Q, K, V?' → Query = what I seek, Key = what I offer, Value = what I pass on.",
        "'Why a context limit?' → attention is **O(n²)** in length.",
        "'Why positional encoding?' → attention is **order-blind** without it.",
        "Transformer block = Attention → Add&Norm → FFN → Add&Norm.",
      ],
      analogyBrief:
        "Attention is highlighting a document before answering: for 'Who built the Eiffel Tower?' you highlight the tower and its builder and ignore the rest.",
    },
    explanation:
      "The Transformer architecture (Vaswani et al., 2017) revolutionized AI by replacing the sequential recurrent networks that came before it with parallel self-attention. RNNs processed a sequence token by token, feeding a hidden state forward, which made them slow to train and caused long-range dependencies to fade over many steps; self-attention instead lets every token directly attend to every other token in the sequence at once, so training parallelizes and distant relationships are captured without vanishing. The mechanism works by projecting each token into three learned vectors — a Query ('what am I looking for?'), a Key ('what information do I offer?'), and a Value ('what information will I pass on?') — and computing Attention(Q, K, V) = softmax(QKᵀ / √dₖ)·V: it takes the dot product of a token's Query with every Key to get similarity scores, scales them by √dₖ so the softmax does not become excessively sharp, applies softmax to turn them into attention weights that sum to one, and produces each token's output as the weighted sum of all Values. Multi-head attention runs several of these attention operations in parallel, each 'head' learning a different kind of relationship — one might track subject-verb syntax, another coreference between pronouns and nouns, another positional patterns — and their outputs are concatenated and linearly projected. A full Transformer layer is Multi-Head Self-Attention, then Add & Norm (a residual connection plus layer normalization), then a position-wise Feed-Forward Network that holds most of the model's stored knowledge, then another Add & Norm; large models stack dozens of these blocks. Two consequences matter constantly in practice: attention is O(n²) in sequence length because every token attends to every other, which is precisely why context windows are bounded and why extending them is expensive; and raw attention is permutation-invariant — it treats the input as an unordered set, so 'the dog bit the man' and 'the man bit the dog' would look identical — which is why positional encodings (absolute sinusoidal patterns in the original paper, Rotary Position Embeddings/RoPE, or ALiBi for length extrapolation) are added to inject the order of tokens.",
    analogy:
      "Self-attention is like highlighting a document before answering a question about it. Asked 'Who built the Eiffel Tower?', you mentally highlight 'Eiffel Tower' and 'Gustave Eiffel' brightly and dim everything irrelevant. A transformer does this with numbers: each word's Query is compared against every other word's Key to decide how brightly to highlight it (the attention weight), then it blends the highlighted words' Values into its own updated meaning. Multi-head attention is having several highlighters of different colors at once — one for grammar, one for who-refers-to-whom, one for position — and combining what each finds.",
    diagram: `<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Self-attention Q/K/V flow and the transformer block">${svgDefs}
      <text x="360" y="22" fill="#e6edf3" font-size="13" font-weight="700" text-anchor="middle">Self-Attention: each token weighs every other token</text>
      ${box(40, 45, 90, 34, "The", "token", "#8b949e")}
      ${box(150, 45, 90, 34, "bank", "query", "#3b82f6")}
      ${box(260, 45, 90, 34, "can", "token", "#8b949e")}
      ${box(370, 45, 110, 34, "deposits", "key/value", "#22c55e")}
      ${box(500, 45, 90, 34, "will", "token", "#8b949e")}
      ${box(600, 45, 90, 34, "cover", "key/value", "#22c55e")}
      <path d="M195 79 Q290 120 425 100" stroke="#22c55e" stroke-width="2.6" fill="none" marker-end="url(#arrow)"/>
      <path d="M195 79 Q400 130 645 100" stroke="#22c55e" stroke-width="1.8" fill="none" marker-end="url(#arrow)"/>
      <path d="M195 79 Q140 110 85 88" stroke="#8b949e" stroke-width="1" stroke-dasharray="3" fill="none" marker-end="url(#arrow-mute)"/>
      <text x="300" y="120" fill="#22c55e" font-size="10">high attention → "bank" = financial bank</text>
      <text x="360" y="150" fill="#8b949e" font-size="10" text-anchor="middle">Attention(Q,K,V) = softmax(QKᵀ / √dₖ) · V</text>
      <rect x="40" y="165" width="640" height="110" rx="10" fill="#1a2332" stroke="#8b5cf6" stroke-dasharray="5 4"/>
      <text x="60" y="186" fill="#8b5cf6" font-size="11" font-weight="700">One Transformer layer (stacked ×N)</text>
      ${box(60, 200, 140, 55, "Multi-Head", "self-attention", "#3b82f6")}
      ${box(220, 200, 110, 55, "Add & Norm", "residual", "#8b949e")}
      ${box(350, 200, 150, 55, "Feed-Forward", "stores knowledge", "#22c55e")}
      ${box(520, 200, 110, 55, "Add & Norm", "residual", "#8b949e")}
      <line x1="200" y1="227" x2="218" y2="227" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="330" y1="227" x2="348" y2="227" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="500" y1="227" x2="518" y2="227" stroke="#ff9900" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="650" y="231" fill="#8b949e" font-size="10">×N</text>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "Query token", description: "Its Query is compared with every Key to score relevance." },
      { color: "#22c55e", label: "Key/Value tokens", description: "High Q·K → their Value is mixed into the output." },
      { color: "#8b5cf6", label: "Transformer layer", description: "Attention → Add&Norm → FFN → Add&Norm, stacked ×N." },
    ],
    codeExample: {
      language: "python",
      title: "Scaled dot-product attention from scratch",
      code: `import numpy as np

def softmax(x):
    e = np.exp(x - x.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

def attention(Q, K, V):
    d_k = Q.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)   # 1) similarity, scaled by sqrt(d_k)
    weights = softmax(scores)         # 2) attention weights (rows sum to 1)
    return weights @ V, weights       # 3) weighted sum of Values

np.random.seed(42)
tokens = np.random.randn(4, 4)        # 4 tokens, d_model = 4
Q = K = V = tokens                    # identity projections for the demo
out, w = attention(Q, K, V)
print("token 0 attends:", w[0].round(3))   # how much of each token it uses`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Attention",
        title: "Scaled dot-product attention, step by step",
        code: `import numpy as np

def softmax(x):
    e = np.exp(x - x.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

def attention(Q, K, V):
    """Q,K: [seq, d_k]  V: [seq, d_v]."""
    d_k = Q.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)   # step 1: scaled similarity
    weights = softmax(scores)         # step 2: probabilities per row
    output = weights @ V              # step 3: weighted sum of values
    return output, weights

np.random.seed(0)
seq, d = 3, 4
X = np.random.randn(seq, d)
out, w = attention(X, X, X)
print("attention weights (rows sum to 1):")
print(w.round(2))
print("each output row is a blend of all value rows:", out.shape)`,
      },
      {
        language: "python",
        tab: "Multi-head",
        title: "Splitting d_model across heads",
        code: `d_model, num_heads = 512, 8
assert d_model % num_heads == 0
d_head = d_model // num_heads          # 64 per head

print(f"d_model={d_model}, heads={num_heads}, d_head={d_head}")
# Each head sees a 64-dim slice and learns a DIFFERENT relationship:
#   head 0 -> subject/verb syntax
#   head 1 -> pronoun -> noun coreference
#   head 2 -> positional / local patterns
# Outputs of all heads are concatenated (8 * 64 = 512) and projected back.
# More heads with the SAME d_model => smaller d_head => diminishing returns.`,
      },
      {
        language: "python",
        tab: "O(n²) cost",
        title: "Why the context window is limited",
        code: `# Attention compares every token with every other token -> n*n scores per layer.
for n in [1_000, 8_000, 128_000]:
    ops = n * n                         # attention matrix entries (per layer)
    print(f"context={n:>7,} tokens -> {ops:>17,} attention scores/layer")

# context=  1,000 tokens ->         1,000,000 attention scores/layer
# context=  8,000 tokens ->        64,000,000
# context=128,000 tokens ->    16,384,000,000
# Quadratic growth is exactly why long context is expensive and bounded.`,
      },
    ],
    problemStatement:
      "You must explain to a teammate why a 128K-token context is dramatically more expensive to serve than an 8K one, and why simply shuffling the words of a sentence into the model can still give a sensible answer unless something is added. Using the attention formula, describe the roles of Q, K, and V, why the score is divided by √dₖ, why the cost is quadratic, and what fixes the order-blindness.",
    questions: [
      {
        q: "In self-attention, what do Query, Key, and Value represent conceptually?",
        options: [
          "A. A SQL query, a primary key, and a stored value",
          "B. Q = 'what am I looking for?', K = 'what information do I offer?', V = 'what information I will pass on'",
          "C. Q = input, K = output, V = hidden state",
          "D. They are three unrelated random vectors with no roles",
        ],
        answer: "B",
        explanation:
          "B is correct: a token's Query is matched against every token's Key to decide attention weights, and the matched tokens' Values are blended into the output. It is a learned soft retrieval, not a database lookup.",
      },
      {
        q: "Why is the attention score divided by √dₖ before the softmax?",
        options: [
          "A. To normalize the sequence length",
          "B. To keep large dot products from making the softmax too sharp (saturated), which would hurt gradients",
          "C. To convert logits into token IDs",
          "D. It is optional and has no measurable effect",
        ],
        answer: "B",
        explanation:
          "B is correct: with large dₖ the dot products grow large in magnitude, pushing softmax toward a one-hot spike with vanishing gradients; scaling by √dₖ keeps the distribution well-conditioned.",
      },
      {
        q: "Why does a Transformer's context window have a practical limit?",
        options: [
          "A. The vocabulary size caps it",
          "B. Self-attention is O(n²) in sequence length — every token attends to every other, so cost grows quadratically",
          "C. The number of attention heads caps it",
          "D. Positional encodings can only count to a fixed number",
        ],
        answer: "B",
        explanation:
          "B is correct: attention builds an n×n score matrix per layer, so doubling the context roughly quadruples the attention compute and memory — the core reason long context is costly and bounded.",
      },
      {
        q: "Why do Transformers need positional encoding if attention already sees all tokens?",
        options: [
          "A. They don't — attention already captures order",
          "B. Raw self-attention is permutation-invariant, so without position information it can't tell 'dog bit man' from 'man bit dog'",
          "C. It is only needed for translation tasks",
          "D. It speeds up the softmax",
        ],
        answer: "B",
        explanation:
          "B is correct: pure attention treats the input as an unordered set, so positional encodings (sinusoidal, RoPE, ALiBi) inject order and break the symmetry, letting the model distinguish word arrangements.",
      },
      {
        q: "What is the role of multi-head attention?",
        options: [
          "A. To make the model larger with no benefit",
          "B. To run several attention operations in parallel, each learning a different type of relationship, then combine them",
          "C. To reduce the context window",
          "D. To replace the feed-forward network",
        ],
        answer: "B",
        explanation:
          "B is correct: each head attends over its own projection and can specialize (syntax, coreference, position); their outputs are concatenated and projected. With a fixed d_model, more heads mean a smaller per-head dimension, so returns diminish.",
      },
      {
        q: "In the Transformer block, where is most of the model's stored 'knowledge' held?",
        options: [
          "A. In the attention scores",
          "B. In the position-wise Feed-Forward Network (which holds most parameters)",
          "C. In the layer-norm parameters",
          "D. In the positional encodings",
        ],
        answer: "B",
        explanation:
          "B is correct: the FFN applied to each position independently contains the bulk of the parameters and encodes learned facts/patterns, while attention routes information between tokens.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "ai-tokens-embeddings",
    title: "Tokens & Embeddings — Subwords and Meaning Vectors",
    shortLabel: "Tokens & Embeddings",
    section: "AI Fundamentals",
    domain: "AI",
    tldr:
      "A token is a subword chunk (Byte-Pair Encoding), the unit LLMs read and the unit you're billed by — roughly ~4 English characters ≈ 1 token, more for non-English. An embedding is a dense vector where similar meanings sit close together, so 'king' and 'queen' are near each other and cosine similarity ranks relevance. Embeddings power semantic search, RAG, clustering, classification, and recommendations.",
    subtopics: [
      {
        heading: "What a token is",
        bullets: [
          { icon: "🔤", text: "A **token** is a subword unit from **Byte-Pair Encoding (BPE)**, not a whole word: 'Unbelievable' → Un·bel·iev·able, 'Python' → 1 token, '!' is often its own token." },
          { icon: "⚖️", text: "Subword tokenization is the sweet spot: character-level wastes context, word-level chokes on unknown words; BPE makes common words one token and splits rare ones." },
          { icon: "📏", text: "**~4 characters ≈ 1 token** in English; non-English text uses **more** tokens per character because the tokenizer saw less of it in training." },
        ],
      },
      {
        heading: "Why tokens matter",
        bullets: [
          { icon: "💰", text: "**Pricing and context are measured in tokens**, so token count — not word count — drives cost and whether your input fits." },
          { icon: "🌍", text: "The same sentence in Japanese can cost 2–3× the tokens of English, which matters for multilingual cost estimates." },
          { icon: "🧮", text: "Always **count tokens** (e.g. a tokenizer library or the provider's token counter) before estimating cost — never assume 1 word = 1 token." },
        ],
      },
      {
        heading: "Embeddings & similarity",
        bullets: [
          { icon: "📍", text: "An **embedding** is a dense vector encoding meaning; similar meanings → nearby vectors, so `king - man + woman ≈ queen` works." },
          { icon: "📐", text: "**Cosine similarity** = (a·b)/(‖a‖‖b‖) measures the **angle** between vectors: 1 = identical direction, 0 = unrelated, −1 = opposite. Preferred over Euclidean for embeddings." },
          { icon: "🔎", text: "Used for **semantic search, RAG, clustering, classification, recommendations** — the core of every vector database." },
        ],
      },
    ],
    keyFacts: [
      { label: "Token size (English)", value: "~4 chars ≈ 1 token", icon: "🔤" },
      { label: "Algorithm", value: "Byte-Pair Encoding (subwords)", icon: "⚖️" },
      { label: "Similarity metric", value: "Cosine similarity (angle)", icon: "📐" },
      { label: "Main use", value: "Semantic search / RAG", icon: "🔎" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Is 1 word = 1 token?' → No; token ≈ **4 English chars**, subword via BPE.",
        "'Why does Japanese cost more?' → **more tokens per character**.",
        "'What is an embedding?' → dense **meaning vector**; near = similar.",
        "'How to rank relevance?' → **cosine similarity** of embeddings.",
        "Embeddings power **semantic search, RAG, clustering, recs**.",
      ],
      analogyBrief:
        "Tokens are a speed-reader's syllable-sized chunks; embeddings are GPS coordinates for meaning, where 'king' and 'queen' are neighbors.",
    },
    explanation:
      "A token is the unit of text that language models actually read, and it is neither a whole word nor a single character but a subword unit produced by Byte-Pair Encoding (BPE) or a similar algorithm: 'Hello world!' becomes ['Hello', ' world', '!'] (three tokens, and note the leading space is part of ' world'), 'Unbelievable' splits into ['Un', 'bel', 'iev', 'able'], while a very common word like 'Python' is a single token. Subword tokenization is a deliberate compromise — character-level tokenization would use far too many tokens and waste the context window, while word-level tokenization would turn any unseen word into an unknown token — so BPE encodes frequent words as one token and splits rare ones into pieces, giving broad coverage with good efficiency; a useful rule of thumb is that about four characters of English equal one token, and non-English languages consume more tokens per character because the tokenizer was trained mostly on English text. This matters enormously in practice because both API pricing and the context window are measured in tokens rather than words, so the same passage can cost two to three times as much in Japanese as in English, and you should always count tokens with a tokenizer (or the provider's token counter) before estimating cost rather than assuming one word equals one token. An embedding, by contrast, is a dense numerical vector that represents meaning: texts with similar meaning map to vectors that point in similar directions, which is why the famous relationship embedding('king') − embedding('man') + embedding('woman') lands near embedding('queen'). The standard way to compare embeddings is cosine similarity, (a·b)/(‖a‖·‖b‖), which measures the angle between two vectors and ranges from 1 (identical direction, semantically the same) through 0 (orthogonal, unrelated) to −1 (opposite); it is preferred over Euclidean distance for embeddings because in high dimensions the direction of a vector carries more useful signal than its magnitude. Embeddings underpin a wide range of applications — semantic search that matches meaning rather than keywords, Retrieval-Augmented Generation that fetches only the relevant context before an LLM call, clustering of similar documents, lightweight classifiers trained on top of embeddings, and recommendation systems — and they are the foundation of every vector database.",
    analogy:
      "Tokens are like the syllable-sized chunks a speed-reader's eye grabs — not whole words, not single letters, but pieces that balance coverage and speed, so a familiar word is one glance and an odd word takes a few. Embeddings are like GPS coordinates for meaning: every word or sentence gets a location in a high-dimensional space where things that mean similar things sit close together, so 'king' and 'queen' are next-door neighbors, 'banana' is across town, and you can even walk from 'king' toward 'woman' and arrive near 'queen'. Cosine similarity is just checking whether two coordinates point in the same direction from the center.",
    diagram: `<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tokenization into subwords and embedding into a meaning space">${svgDefs}
      <text x="185" y="24" fill="#e6edf3" font-size="12" font-weight="700" text-anchor="middle">Text → tokens (BPE)</text>
      ${box(30, 44, 300, 34, '"Unbelievable result!"', "raw text", "#8b949e")}
      <line x1="180" y1="78" x2="180" y2="96" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrow)"/>
      ${box(30, 100, 60, 30, "Un", "", "#3b82f6")}
      ${box(96, 100, 60, 30, "bel", "", "#3b82f6")}
      ${box(162, 100, 60, 30, "iev", "", "#3b82f6")}
      ${box(228, 100, 60, 30, "able", "", "#3b82f6")}
      ${box(294, 100, 36, 30, "!", "", "#3b82f6")}
      <text x="30" y="158" fill="#8b949e" font-size="10">1 word ≈ 4 tokens · ~4 chars ≈ 1 token (English)</text>
      <text x="30" y="176" fill="#8b949e" font-size="10">non-English text → more tokens per character</text>
      <text x="540" y="24" fill="#e6edf3" font-size="12" font-weight="700" text-anchor="middle">Embedding space (2-D view)</text>
      <rect x="380" y="40" width="320" height="220" rx="10" fill="#1a2332" stroke="#8b5cf6"/>
      <circle cx="450" cy="90" r="6" fill="#3b82f6"/><text x="462" y="94" fill="#3b82f6" font-size="11">king</text>
      <circle cx="490" cy="105" r="6" fill="#3b82f6"/><text x="502" y="109" fill="#3b82f6" font-size="11">queen</text>
      <circle cx="465" cy="135" r="6" fill="#3b82f6" opacity="0.7"/><text x="477" y="139" fill="#8b949e" font-size="11">prince</text>
      <circle cx="600" cy="95" r="6" fill="#22c55e"/><text x="612" y="99" fill="#22c55e" font-size="11">cat</text>
      <circle cx="630" cy="120" r="6" fill="#22c55e"/><text x="642" y="124" fill="#22c55e" font-size="11">dog</text>
      <circle cx="430" cy="215" r="6" fill="#f59e0b"/><text x="442" y="219" fill="#f59e0b" font-size="11">Python</text>
      <circle cx="480" cy="230" r="6" fill="#f59e0b"/><text x="492" y="234" fill="#f59e0b" font-size="11">JavaScript</text>
      <circle cx="472" cy="112" r="42" fill="none" stroke="#3b82f6" stroke-dasharray="4" opacity="0.6"/>
      <circle cx="615" cy="108" r="30" fill="none" stroke="#22c55e" stroke-dasharray="4" opacity="0.6"/>
      <text x="400" y="252" fill="#8b949e" font-size="10">similar meaning → nearby vectors (high cosine similarity)</text>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "Subword tokens", description: "BPE splits rare words; common words stay whole." },
      { color: "#8b5cf6", label: "Embedding space", description: "Dense vectors where nearby = semantically similar." },
      { color: "#22c55e", label: "Semantic clusters", description: "Related concepts group together; cosine ranks them." },
    ],
    codeExample: {
      language: "python",
      title: "Count tokens and rank documents by cosine similarity",
      code: `import numpy as np

def cosine_similarity(a, b):
    return (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Pretend these came from an embeddings model (dozens/thousands of dims):
king  = np.array([0.9, 0.8, 0.1])
queen = np.array([0.85, 0.82, 0.15])
banana = np.array([-0.2, 0.1, 0.95])

print("king ~ queen :", round(cosine_similarity(king, queen), 3))   # ~0.999
print("king ~ banana:", round(cosine_similarity(king, banana), 3))  # low
# 1.0 = same meaning direction, ~0 = unrelated, -1 = opposite.`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Count tokens",
        title: "Estimate tokens and cost before an API call",
        code: `# Rule of thumb: ~4 English characters per token (verify with a tokenizer).
def estimate_tokens(text: str) -> int:
    return max(1, round(len(text) / 4))

samples = [
    "Hello world!",
    "Unbelievable performance metrics.",
    "Python",
    "def cosine_similarity(a, b): ...",
]
for s in samples:
    print(f"{estimate_tokens(s):3d} est. tokens | {s}")

# Cost example: 1,000-word doc ~ 1,333 tokens.
tokens = 1333
input_cost = tokens / 1_000_000 * 3          # $3 / million input tokens
print(f"1,000-word doc ~ {tokens} tokens ~ \${input_cost:.4f}")`,
      },
      {
        language: "python",
        tab: "Semantic search",
        title: "Rank documents against a query with cosine similarity",
        code: `import numpy as np

def cosine(query, docs):
    return (docs @ query) / (
        np.linalg.norm(docs, axis=1) * np.linalg.norm(query)
    )

# In practice these vectors come from an embeddings API/model.
docs = np.array([
    [0.81, 0.10, 0.05],   # "gradient descent optimizes neural nets"
    [0.62, 0.30, 0.10],   # "transformers use self-attention"
    [0.05, 0.90, 0.20],   # "docker packages dependencies"
])
labels = ["neural nets", "transformers", "docker"]
query = np.array([0.78, 0.12, 0.06])          # "how do neural networks learn?"

scores = cosine(query, docs)
for score, label in sorted(zip(scores, labels), reverse=True):
    print(f"{score:.3f} | {label}")           # top match = neural nets`,
      },
      {
        language: "python",
        tab: "Word analogy",
        title: "king - man + woman ≈ queen",
        code: `import numpy as np

# Toy 3-D embeddings just to show the vector arithmetic.
emb = {
    "king":  np.array([0.90, 0.10, 0.80]),
    "man":   np.array([0.20, 0.10, 0.75]),
    "woman": np.array([0.20, 0.85, 0.75]),
    "queen": np.array([0.90, 0.85, 0.80]),
}

result = emb["king"] - emb["man"] + emb["woman"]
def cos(a, b): return (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))

for word, vec in emb.items():
    print(f"{word:6s} cos-to-result = {cos(result, vec):.3f}")
# 'queen' scores highest -> meaning is captured by vector geometry.`,
      },
    ],
    problemStatement:
      "A product team estimates cost by assuming '1 word = 1 token' and is baffled that their Japanese support tickets cost far more than the English ones and sometimes overflow the context window. They also built keyword search that misses obvious paraphrases ('automobile' vs 'car'). Explain how tokenization really works and why Japanese costs more, and how embeddings plus cosine similarity fix the search.",
    questions: [
      {
        q: "Approximately how many tokens is 'Hello world!'?",
        options: ["A. 1", "B. 2", "C. 3", "D. 11"],
        answer: "C",
        explanation:
          "C is correct: it tokenizes to ['Hello', ' world', '!'] = 3 tokens (punctuation is often its own token, and the leading space is part of ' world'). Rule of thumb: ~4 English characters per token.",
      },
      {
        q: "Which tokenization scheme do modern LLMs typically use, and why?",
        options: [
          "A. Character-level, because it uses the fewest tokens",
          "B. Word-level, because every word maps to exactly one token",
          "C. Subword (Byte-Pair Encoding), because it makes common words one token and splits rare words, handling unknown words efficiently",
          "D. Sentence-level, to preserve grammar",
        ],
        answer: "C",
        explanation:
          "C is correct: BPE subword tokenization keeps frequent words compact and splits rare words into pieces, avoiding the wasted context of character-level and the unknown-word problem of word-level.",
      },
      {
        q: "Why does Japanese text generally use more tokens per character than English?",
        options: [
          "A. Japanese is inherently harder to process",
          "B. BPE tokenizers are trained mostly on English, so rarer non-English characters get split into smaller subword units",
          "C. Providers deliberately overcharge for Japanese",
          "D. Japanese has fewer distinct characters",
        ],
        answer: "B",
        explanation:
          "B is correct: since the tokenizer saw far more English during training, English words often become single tokens while Japanese characters split into 2–3 tokens each, raising token count and cost.",
      },
      {
        q: "What does cosine similarity between two embedding vectors measure?",
        options: [
          "A. The Euclidean distance between the vectors",
          "B. The angle between the vectors — 1 = same direction (semantically identical), 0 = unrelated, −1 = opposite",
          "C. The sum of all vector dimensions",
          "D. How many words the two texts literally share",
        ],
        answer: "B",
        explanation:
          "B is correct: cosine similarity = (a·b)/(‖a‖‖b‖) captures the angle regardless of magnitude, which is why it is preferred for embeddings where direction carries the meaning.",
      },
      {
        q: "Which task is embeddings + cosine similarity best suited for?",
        options: [
          "A. Exact substring matching only",
          "B. Semantic search / RAG — matching by meaning so 'automobile' matches 'car'",
          "C. Compressing images",
          "D. Encrypting API keys",
        ],
        answer: "B",
        explanation:
          "B is correct: embeddings capture meaning, so semantic search and RAG retrieve conceptually relevant text even when the wording differs — something keyword matching misses on synonyms and paraphrases.",
      },
      {
        q: "Which best explains the relationship embedding('king') − embedding('man') + embedding('woman') ≈ embedding('queen')?",
        options: [
          "A. It is a coincidence with no meaning",
          "B. Embeddings encode semantic relationships as consistent directions in vector space, so gender/royalty offsets are approximately linear",
          "C. The model looks up a hard-coded analogy table",
          "D. It only works if the words are the same length",
        ],
        answer: "B",
        explanation:
          "B is correct: well-trained embeddings place related concepts so that semantic differences (like gender) correspond to roughly consistent vector directions, making analogy arithmetic land near the expected word.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "ai-model-evaluation",
    title: "Model Evaluation — Benchmarks, Metrics & LLM-as-Judge",
    shortLabel: "Model Evaluation",
    section: "AI Fundamentals",
    domain: "AI",
    tldr:
      "LLM evaluation is hard because outputs are open-ended, tasks are diverse, and quality is subjective. Public benchmarks (MMLU, HumanEval, GSM8K, LMSYS Arena) give a rough comparison but suffer from contamination — models may have seen the test data. Pick metrics per task (accuracy/F1 for classification; BLEU/ROUGE/perplexity for generation). For production, an evaluation pyramid — human eval (most reliable) → LLM-as-judge (~80% human agreement, scalable) → task metrics → benchmarks — and your OWN evals on your data beat any leaderboard.",
    subtopics: [
      {
        heading: "Why evaluating LLMs is hard",
        bullets: [
          { icon: "🎨", text: "**Open-ended outputs** — 'write a poem' has infinitely many valid answers, so exact-match metrics fail." },
          { icon: "🎭", text: "**Task diversity + subjectivity** — one model does coding, summarizing, and reasoning; 'helpful' depends on context." },
          { icon: "🧪", text: "**Benchmark contamination** — models trained on internet text may have already seen the benchmark questions, inflating scores." },
        ],
      },
      {
        heading: "Benchmarks & task metrics",
        bullets: [
          { icon: "📚", text: "**MMLU** = 57-subject knowledge, **HumanEval** = Python code, **GSM8K/MATH** = math, **LMSYS Arena** = human pairwise preferences (often the most trusted public signal)." },
          { icon: "🔢", text: "**Classification** → accuracy, F1, precision/recall, AUC-ROC. **Generation** → **BLEU** (translation), **ROUGE** (summarization), **BERTScore**, **perplexity** (lower = better)." },
          { icon: "⚠️", text: "Treat public scores as **approximate comparisons**, not absolute truth — new/private evals are more reliable." },
        ],
      },
      {
        heading: "LLM-as-judge & your own evals",
        bullets: [
          { icon: "⚖️", text: "**LLM-as-judge** uses a capable model + a rubric to score outputs; ~80% correlation with human judgment, scalable to thousands of cases — but can be biased toward verbose/confident answers." },
          { icon: "🏗️", text: "**Build your own eval set** (50–100+ representative cases from your real task) — this predicts production quality far better than a leaderboard rank." },
          { icon: "🔺", text: "The **evaluation pyramid**: human eval (gold, costly) → LLM-as-judge (scalable) → task-specific metrics → public benchmarks (cheap, contamination risk)." },
        ],
      },
    ],
    keyFacts: [
      { label: "MMLU", value: "57-subject factual knowledge", icon: "📚" },
      { label: "LLM-as-judge", value: "~80% agreement, scalable", icon: "⚖️" },
      { label: "Perplexity", value: "Model 'surprise' (lower better)", icon: "🔢" },
      { label: "Best signal", value: "Your own eval on your data", icon: "🏗️" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'Why not trust the leaderboard?' → **benchmark contamination** + your task differs.",
        "'MMLU measures?' → 57-subject **factual knowledge**, not instruction-following.",
        "'Scale eval of open-ended text?' → **LLM-as-judge** with a rubric.",
        "'Most reliable public benchmark?' → **LMSYS Arena** (human preference).",
        "Generation metrics: **BLEU** (MT), **ROUGE** (summaries), **perplexity**.",
      ],
      analogyBrief:
        "Benchmarks are school exams: a 95% on a biology quiz doesn't prove someone can perform your surgery — test on your actual procedure.",
    },
    explanation:
      "Evaluating large language models is genuinely hard, unlike a plain classifier where accuracy is unambiguous. The outputs are open-ended (a prompt like 'write a poem' has infinitely many valid answers, defeating exact-match scoring), the tasks are diverse (the same model writes code, summarizes, and reasons), quality is subjective (whether an answer is helpful or harmful depends on context), and there is benchmark contamination — because models are trained on huge swaths of the internet, they may have already seen the very questions a public benchmark uses, inflating scores so that a high number reflects memorization rather than reasoning. The well-known public benchmarks each probe a slice: MMLU tests factual knowledge across 57 subjects via multiple choice (memorization, not necessarily reasoning), HumanEval measures Python code generation on 164 problems, GSM8K and MATH test grade-school and competition math, HellaSwag tests common-sense completion, TruthfulQA probes truthfulness, and the LMSYS Chatbot Arena ranks models by blind human pairwise preferences — often considered the most trustworthy public signal because it reflects actual human judgment rather than multiple choice. You should match the metric to the task: for classification use accuracy, F1, precision, recall, and AUC-ROC; for text generation use BLEU (n-gram overlap, common in machine translation), ROUGE (recall-oriented overlap, common in summarization), BERTScore (embedding similarity to a reference), and perplexity (how 'surprised' the model is by held-out text, where lower is better); and for open-ended LLM output, human evaluation is the gold standard but expensive, LLM-as-judge (prompting a capable model with a rubric to score outputs) is scalable and correlates around 80% with human judgment though it can be biased toward verbose or confident answers, and task-specific metrics like Pass@k for code or exact match for closed QA are automated and fast. The single most valuable practice for production systems is to build your own evaluation set — 50 to 100 or more representative cases drawn from your actual task and data distribution — because a model ranked third on MMLU may well beat the top-ranked one on your specific use case; a model that is great at trivia might still fail to reliably format JSON or follow your instructions. A useful mental model is the evaluation pyramid, ordered from most reliable and expensive to most scalable and cheap: human evaluation at the top, then LLM-as-judge, then task-specific automated metrics, then public benchmarks at the bottom (cheap but carrying contamination risk).",
    analogy:
      "Benchmarks are like school exams. A model that scores 95% on MMLU has 'memorized' a lot of academic material, but that number does not tell you whether it can reliably format JSON, follow your specific instructions, or handle your domain's edge cases — just as you would not hire a surgeon based on their biology quiz score. You would test them on your actual surgical procedures. Building your own eval set is exactly that: instead of trusting a generic report card, you give each candidate the specific problems your product must solve and grade them on those. And LLM-as-judge is like having an experienced examiner mark thousands of open-ended essays against a clear rubric — far faster than a human panel, agreeing with them most of the time, though occasionally over-rewarding a confident, wordy answer.",
    diagram: `<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Evaluation pyramid trading reliability against scalability">${svgDefs}
      <text x="360" y="24" fill="#e6edf3" font-size="13" font-weight="700" text-anchor="middle">The Evaluation Pyramid — reliability vs scalability</text>
      <polygon points="360,45 220,235 500,235" fill="#1a2332" stroke="#8b5cf6"/>
      <polygon points="360,45 315,105 405,105" fill="#22c55e" opacity="0.9"/>
      <text x="360" y="88" fill="#e6edf3" font-size="11" text-anchor="middle" font-weight="600">Human eval</text>
      <polygon points="315,105 285,165 435,165 405,105" fill="#3b82f6" opacity="0.85"/>
      <text x="360" y="140" fill="#e6edf3" font-size="11" text-anchor="middle" font-weight="600">LLM-as-judge</text>
      <polygon points="285,165 255,205 465,205 435,165" fill="#f59e0b" opacity="0.8"/>
      <text x="360" y="190" fill="#0d1117" font-size="11" text-anchor="middle" font-weight="600">Task-specific metrics</text>
      <polygon points="255,205 220,235 500,235 465,205" fill="#e11d8f" opacity="0.75"/>
      <text x="360" y="226" fill="#e6edf3" font-size="10" text-anchor="middle" font-weight="600">Public benchmarks (MMLU, HumanEval)</text>
      <text x="520" y="80" fill="#22c55e" font-size="11">↑ most reliable</text>
      <text x="520" y="96" fill="#8b949e" font-size="10">most expensive</text>
      <text x="520" y="222" fill="#e11d8f" font-size="11">↓ most scalable</text>
      <text x="520" y="238" fill="#8b949e" font-size="10">contamination risk</text>
      <text x="30" y="150" fill="#8b949e" font-size="10">Best predictor of</text>
      <text x="30" y="166" fill="#8b949e" font-size="10">production quality:</text>
      <text x="30" y="182" fill="#e6edf3" font-size="10" font-weight="700">your own eval set</text>
      <text x="30" y="198" fill="#8b949e" font-size="10">on your data.</text>
    </svg>`,
    diagramLegend: [
      { color: "#22c55e", label: "Human eval", description: "Gold standard for open-ended quality; slow and costly." },
      { color: "#3b82f6", label: "LLM-as-judge", description: "Scalable, ~80% human agreement, rubric-driven." },
      { color: "#e11d8f", label: "Public benchmarks", description: "Cheap comparison, but contamination inflates scores." },
    ],
    codeExample: {
      language: "python",
      title: "A simple task-specific eval for a support bot",
      code: `test_cases = [
    {
        "input": "How do I reset my password?",
        "expected_keywords": ["reset", "email", "link"],
        "banned": ["fake_url"],
        "max_words": 150,
    },
    # ... 50-100+ representative cases from YOUR real traffic
]

def evaluate(response: str, case: dict) -> dict:
    kw = case["expected_keywords"]
    r = {
        "keyword_coverage": sum(k in response.lower() for k in kw) / len(kw),
        "no_banned": not any(b in response for b in case["banned"]),
        "length_ok": len(response.split()) <= case["max_words"],
    }
    r["pass"] = r["keyword_coverage"] >= 0.6 and r["no_banned"] and r["length_ok"]
    return r`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Task metrics",
        title: "Precision, recall, and F1 for a classifier",
        code: `def prf1(tp, fp, fn):
    precision = tp / (tp + fp) if (tp + fp) else 0.0
    recall    = tp / (tp + fn) if (tp + fn) else 0.0
    f1 = (2 * precision * recall / (precision + recall)
          if (precision + recall) else 0.0)
    return precision, recall, f1

# Imbalanced data: accuracy can lie, F1 is more honest.
tp, fp, fn = 40, 10, 20
p, r, f1 = prf1(tp, fp, fn)
print(f"precision={p:.2f}  recall={r:.2f}  F1={f1:.2f}")
# Use accuracy for balanced classes; F1 when classes are imbalanced.`,
      },
      {
        language: "python",
        tab: "LLM-as-judge",
        title: "Score an answer with a capable model + rubric",
        code: `import json
from anthropic import Anthropic

client = Anthropic()

def judge(question: str, answer: str, rubric: str) -> dict:
    prompt = (
        "You are an objective evaluator. Score strictly per the rubric.\\n\\n"
        f"QUESTION: {question}\\n\\nANSWER: {answer}\\n\\nRUBRIC: {rubric}\\n\\n"
        'Respond with JSON only: {"score": <1-5>, "pass": <true|false>, '
        '"reasoning": "<one sentence>"}'
    )
    resp = client.messages.create(
        model="claude-sonnet-5",              # a capable judge model
        max_tokens=200,
        temperature=0,                        # deterministic scoring
        messages=[{"role": "user", "content": prompt}],
    )
    return json.loads(resp.content[0].text)

# ~80% agreement with humans; watch for bias toward verbose/confident answers.`,
      },
      {
        language: "python",
        tab: "Own eval set",
        title: "Run your eval set and report a pass rate",
        code: `def run_suite(model_fn, cases, grade_fn):
    passed = 0
    for c in cases:
        output = model_fn(c["input"])
        result = grade_fn(output, c)
        passed += bool(result["pass"])
        print(f"{'PASS' if result['pass'] else 'FAIL'} | {c['input'][:40]}")
    rate = passed / len(cases)
    print(f"\\nPass rate: {passed}/{len(cases)} = {rate:.0%}")
    return rate

# A model ranked 3rd on MMLU can still win on YOUR eval set.
# Track this pass rate across model/prompt changes as your north star.`,
      },
    ],
    problemStatement:
      "Two candidate models are being compared for a customer-support assistant. Model A ranks higher on MMLU; Model B ranks lower but 'feels' better in demos. Leadership wants to pick Model A purely on the leaderboard. Explain why the MMLU ranking is a weak basis for this decision, what contamination is, and how you would design an evaluation (metrics, LLM-as-judge, your own eval set) that actually predicts production quality.",
    questions: [
      {
        q: "What does the MMLU benchmark primarily measure?",
        options: [
          "A. Python code generation ability",
          "B. 57-subject factual/academic knowledge via multiple-choice questions",
          "C. Response latency",
          "D. Creative writing quality",
        ],
        answer: "B",
        explanation:
          "B is correct: MMLU (Massive Multitask Language Understanding) tests factual recall across 57 subjects. A high score signals broad knowledge but not instruction-following, reasoning quality, or coding reliability.",
      },
      {
        q: "What is benchmark contamination?",
        options: [
          "A. A model producing toxic content",
          "B. Test data appearing in the model's training set, so scores reflect memorization rather than genuine capability",
          "C. Running benchmarks too slowly",
          "D. Two models sharing one benchmark",
        ],
        answer: "B",
        explanation:
          "B is correct: when benchmark questions leak into training data, the model may have memorized answers, inflating scores. This makes public benchmarks approximate comparisons at best; private/internal evals are more reliable.",
      },
      {
        q: "Which metric is most appropriate for evaluating summarization quality against reference summaries?",
        options: [
          "A. BLEU",
          "B. ROUGE (recall-oriented n-gram overlap)",
          "C. AUC-ROC",
          "D. Learning rate",
        ],
        answer: "B",
        explanation:
          "B is correct: ROUGE is recall-oriented overlap designed for summarization. BLEU is more common for machine translation, AUC-ROC is a classification metric, and learning rate is a training hyperparameter, not an eval metric.",
      },
      {
        q: "Why is LLM-as-judge useful despite its limitations?",
        options: [
          "A. It is free and perfectly accurate",
          "B. It scales to thousands of open-ended outputs while correlating ~80% with human judgment — far more scalable than human eval and more nuanced than exact-match",
          "C. It is completely free of bias",
          "D. It requires no rubric or prompt",
        ],
        answer: "B",
        explanation:
          "B is correct: a capable model with a rubric can score huge volumes of open-ended output quickly and agrees with humans most of the time. Its main caveat is bias toward verbose/confident answers, so pair it with spot human review.",
      },
      {
        q: "For selecting a model for a specific production task, what is the MOST reliable evaluation?",
        options: [
          "A. Whichever model ranks first on MMLU",
          "B. Your own eval set of representative cases from your actual task and data distribution",
          "C. The model with the most parameters",
          "D. The model with the lowest price",
        ],
        answer: "B",
        explanation:
          "B is correct: internal evals on your real data predict production quality far better than a generic leaderboard, since a model that trails on public benchmarks can still win on your specific task.",
      },
      {
        q: "What does perplexity measure for a language model?",
        options: [
          "A. How fast the model generates tokens",
          "B. How 'surprised' the model is by held-out test text — lower perplexity is better",
          "C. The number of parameters",
          "D. The size of the context window",
        ],
        answer: "B",
        explanation:
          "B is correct: perplexity quantifies the model's uncertainty (surprise) over unseen text; lower means the model assigns higher probability to the true tokens. It is a fluency/likelihood measure, not a speed or size metric.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "ai-context-memory",
    title: "Context Windows & Memory — Fitting, Losing & Retrieving",
    shortLabel: "Context & Memory",
    section: "AI Fundamentals",
    domain: "AI",
    tldr:
      "The context window is the maximum number of tokens a model can process in one call — everything (system prompt, retrieved docs, history, current query, and its own output so far) must fit, or the API errors. Models also retrieve worse from the middle of long contexts ('lost in the middle'), so put key content first or last. Manage long conversations with a sliding window, summarization, or RAG, and cut cost/latency with prompt caching by putting stable content first.",
    subtopics: [
      {
        heading: "What the context window is",
        bullets: [
          { icon: "🪟", text: "The **context window** is the max tokens per inference call; frontier models commonly offer very large windows (hundreds of thousands of tokens; ~200K ≈ several novels)." },
          { icon: "📦", text: "**Everything must fit**: system prompt + few-shot examples + retrieved docs (RAG) + conversation history + current query + the model's output so far." },
          { icon: "❌", text: "Overflow is a **hard error** (context length exceeded) — the model does not auto-compress; you must trim, summarize, or retrieve." },
        ],
      },
      {
        heading: "Lost in the middle",
        bullets: [
          { icon: "📉", text: "LLMs retrieve information **worse from the middle** of a long context than from the beginning or end (recall can drop from ~90% to ~40%)." },
          { icon: "🔝", text: "**Put the most important context first or last** — don't bury key constraints or facts in the middle of a long prompt." },
          { icon: "🧠", text: "Context ≠ persistent memory: outside the window the model has **no access** to earlier text; long-term memory needs RAG or a database." },
        ],
      },
      {
        heading: "Managing memory & cost",
        bullets: [
          { icon: "🪟", text: "**Sliding window** — keep the system message + most recent turns, drop the oldest, so the conversation always fits." },
          { icon: "🗜️", text: "**Summarization** compresses old turns into a short summary; **RAG** retrieves only relevant chunks instead of stuffing everything in." },
          { icon: "⚡", text: "**Prompt caching** — providers cache the attention KV pairs for a stable prompt **prefix**, so putting the long static system prompt first makes repeat calls cheaper and faster." },
        ],
      },
    ],
    keyFacts: [
      { label: "Context window", value: "Max tokens per call", icon: "🪟" },
      { label: "Overflow", value: "Hard API error (no auto-trim)", icon: "❌" },
      { label: "Lost in middle", value: "Recall ~90% ends, ~40% middle", icon: "📉" },
      { label: "Cheaper repeats", value: "Prompt caching (stable prefix)", icon: "⚡" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'History exceeds the window?' → **hard error**; trim/summarize/RAG first.",
        "'Lost in the middle' → put key context **first or last**.",
        "'Long conversations' → **sliding window**, **summarization**, or **RAG**.",
        "'Cheaper repeated calls' → **prompt caching** with a stable prefix.",
        "Context window ≠ memory — outside it the model can't see earlier text.",
      ],
      analogyBrief:
        "The context window is working memory: powerful within its limit, blind beyond it. RAG and databases are notes on the desk — retrievable, not held in mind.",
    },
    explanation:
      "The context window (or context length) is the maximum number of tokens a language model can process in a single inference call, and frontier models today commonly offer very large windows — on the order of a hundred thousand to several hundred thousand tokens, where roughly 200,000 tokens is about 150,000 words or a few average novels. Crucially, everything the model 'sees' must fit inside that window at once: the system prompt, any few-shot examples, documents retrieved for RAG, the running conversation history, the current user message, and even the model's own output as it is generated all consume the same budget. When the combined content exceeds the limit the API returns a hard error (a context-length-exceeded error) — the model does not silently or automatically compress anything — so you must proactively trim, summarize, or retrieve to stay under the ceiling. A second, subtler issue is the 'lost in the middle' phenomenon: research shows that LLMs retrieve information noticeably worse when the relevant passage sits in the middle of a long context than when it sits at the beginning or the end, with recall dropping from around 90% at the boundaries to as low as ~40% in the middle, so the practical rule is to place the most important instructions or facts at the very start or very end of your prompt rather than burying them. It is also important to remember that the context window is not persistent memory — outside the window the model has no access to earlier text at all, which is why long-term memory requires external systems. There are three standard strategies for managing long interactions: a sliding window keeps the system message plus the most recent turns and drops the oldest so the conversation always fits; summarization compresses older turns into a short summary (turning thousands of tokens of history into a hundred); and Retrieval-Augmented Generation retrieves only the chunks relevant to the current query via semantic search instead of stuffing everything into the prompt. Finally, prompt caching cuts cost and latency: providers can reuse the computed attention key-value cache for a stable prompt prefix, so if consecutive calls share a long static system prompt and instructions, putting that stable content first (and the changing user query last) lets repeated calls hit the cache and run much cheaper.",
    analogy:
      "The context window is like a person's working memory. A human can actively juggle only a handful of things at once; an LLM can actively process everything up to its token limit and nothing beyond it. Both do impressive work within that limit and both struggle the moment you ask them to hold more than fits. 'Lost in the middle' is like being read a long list of instructions — you remember the first few and the last few clearly but the ones in the middle blur. External memory (a vector database for RAG, a key-value store, saved summaries) is like notes spread on your desk: not in your head right now, but you can glance at exactly the note you need when you need it. Prompt caching is keeping your standing instructions pinned to the top of the desk so you don't have to re-read them every time.",
    diagram: `<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="What fills the context window and the lost-in-the-middle effect">${svgDefs}
      <text x="360" y="22" fill="#e6edf3" font-size="13" font-weight="700" text-anchor="middle">What fills the context window (everything must fit)</text>
      <rect x="30" y="40" width="660" height="52" rx="8" fill="#1a2332" stroke="#8b5cf6"/>
      <rect x="30" y="40" width="90" height="52" rx="6" fill="#3b82f6" opacity="0.85"/>
      <text x="75" y="70" fill="#e6edf3" font-size="9" text-anchor="middle">System prompt</text>
      <rect x="122" y="40" width="120" height="52" fill="#22c55e" opacity="0.8"/>
      <text x="182" y="70" fill="#0d1117" font-size="9" text-anchor="middle">Retrieved docs (RAG)</text>
      <rect x="244" y="40" width="140" height="52" fill="#f59e0b" opacity="0.8"/>
      <text x="314" y="70" fill="#0d1117" font-size="9" text-anchor="middle">Conversation history</text>
      <rect x="386" y="40" width="110" height="52" fill="#e11d8f" opacity="0.8"/>
      <text x="441" y="70" fill="#e6edf3" font-size="9" text-anchor="middle">Current query</text>
      <rect x="498" y="40" width="192" height="52" fill="#243349" stroke="#8b949e" stroke-dasharray="4"/>
      <text x="594" y="70" fill="#8b949e" font-size="9" text-anchor="middle">remaining (+ output)</text>
      <text x="360" y="120" fill="#e6edf3" font-size="12" font-weight="700" text-anchor="middle">"Lost in the middle" — recall by position</text>
      <rect x="120" y="150" width="60" height="90" rx="4" fill="#22c55e"/>
      <text x="150" y="255" fill="#e6edf3" font-size="10" text-anchor="middle">Start</text>
      <text x="150" y="270" fill="#22c55e" font-size="10" text-anchor="middle">~90%</text>
      <rect x="330" y="205" width="60" height="35" rx="4" fill="#f85149"/>
      <text x="360" y="255" fill="#e6edf3" font-size="10" text-anchor="middle">Middle</text>
      <text x="360" y="270" fill="#f85149" font-size="10" text-anchor="middle">~40%</text>
      <rect x="540" y="158" width="60" height="82" rx="4" fill="#22c55e" opacity="0.85"/>
      <text x="570" y="255" fill="#e6edf3" font-size="10" text-anchor="middle">End</text>
      <text x="570" y="270" fill="#22c55e" font-size="10" text-anchor="middle">~85%</text>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "System prompt", description: "Stable prefix; put first so it can be cached." },
      { color: "#f59e0b", label: "History", description: "Trim with a sliding window or summarize when it grows." },
      { color: "#f85149", label: "Middle position", description: "Recall dips here — keep key content at the edges." },
    ],
    codeExample: {
      language: "python",
      title: "Sliding-window trim to fit the context",
      code: `def count_tokens(messages):
    # ~4 chars per token approximation (use a real tokenizer in production).
    return sum(max(1, len(m["content"]) // 4) for m in messages)

def trim_to_context(messages, max_tokens=100_000, reserve_output=4096):
    limit = max_tokens - reserve_output
    system = [m for m in messages if m["role"] == "system"]
    convo  = [m for m in messages if m["role"] != "system"]
    while convo and count_tokens(system + convo) > limit:
        convo = convo[2:]                      # drop oldest user+assistant pair
    return system + convo                      # always keep system + recent turns`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Fits check",
        title: "Refuse to overflow — check before calling",
        code: `def count_tokens(text: str) -> int:
    return max(1, len(text) // 4)              # approx; use a real tokenizer

def fits_in_context(messages, model_limit=128_000, reserve_output=4096) -> bool:
    total = sum(count_tokens(m["content"]) for m in messages)
    return total < model_limit - reserve_output

msgs = [{"role": "system", "content": "You are concise."},
        {"role": "user", "content": "x" * 600_000}]   # huge input
print("fits?", fits_in_context(msgs))          # False -> trim before calling
# Overflow raises a hard 'context_length_exceeded' error; never rely on auto-trim.`,
      },
      {
        language: "python",
        tab: "Summarize",
        title: "Compress old turns to reclaim tokens",
        code: `def summarize_old_turns(history, keep_recent=4, summarizer=None):
    """Replace all but the most recent turns with one short summary."""
    if len(history) <= keep_recent:
        return history
    old, recent = history[:-keep_recent], history[-keep_recent:]
    summary_text = summarizer(old) if summarizer else f"[summary of {len(old)} turns]"
    return [{"role": "system", "content": f"Earlier context: {summary_text}"}] + recent

# 20 turns x 200 tokens = 4000 tokens  ->  1 summary x ~100 tokens (saves ~3900).
# Trade full fidelity for staying inside the window on long chats.`,
      },
      {
        language: "python",
        tab: "Cache-aware",
        title: "Order the prompt so the prefix caches",
        code: `LONG_STATIC_SYSTEM_PROMPT = "...(instructions, style guide, tools)..."

def build_messages(user_query: str):
    return [
        # Stable prefix FIRST -> provider caches its KV pairs -> cheaper repeats.
        {"role": "system", "content": LONG_STATIC_SYSTEM_PROMPT},
        # Only this changes each call, so the cache prefix stays valid.
        {"role": "user", "content": user_query},
    ]

# Keep the static content identical across calls, and put it before the
# dynamic query, to maximize prompt-cache hits (big cost/latency wins).`,
      },
    ],
    problemStatement:
      "A multi-turn assistant works in demos but in production it (a) throws 'context length exceeded' after long chats, (b) frequently ignores a critical rule you placed in the middle of a huge system prompt, and (c) is far more expensive than expected on repeated similar requests. Diagnose each symptom and give the concrete fix for each: how to keep the conversation fitting, where to place the rule, and how to cut the repeat-call cost.",
    questions: [
      {
        q: "What happens when the conversation history exceeds the context window?",
        options: [
          "A. The model automatically compresses the history",
          "B. The API call fails with a context-length error unless you trim, summarize, or retrieve first",
          "C. The model switches to its parametric memory",
          "D. The oldest tokens are silently kept and newest dropped",
        ],
        answer: "B",
        explanation:
          "B is correct: the token limit is hard, so overflow returns a context_length_exceeded error. The model performs no automatic compression — you must trim history, summarize old turns, or use RAG.",
      },
      {
        q: "What is the 'lost in the middle' problem?",
        options: [
          "A. Models always forget the start of a conversation",
          "B. LLMs retrieve information worse from the middle of a long context than from the beginning or end",
          "C. Very long contexts crash the API",
          "D. Models cannot read more than one document",
        ],
        answer: "B",
        explanation:
          "B is correct: recall for relevant information dips substantially (toward ~40%) when it sits mid-context versus ~85–90% at the edges, so critical content should go at the start or end of the prompt.",
      },
      {
        q: "Which is NOT a valid strategy for managing long conversation history?",
        options: [
          "A. Sliding window (keep recent turns, drop oldest)",
          "B. Summarizing old turns into a short summary",
          "C. Retrieval-Augmented Generation to fetch only relevant chunks",
          "D. Assuming the model will automatically remember everything forever",
        ],
        answer: "D",
        explanation:
          "D is correct as the invalid option: the model has no persistent memory beyond the window. Sliding window, summarization, and RAG are the real strategies; expecting infinite automatic memory is a bug.",
      },
      {
        q: "What is prompt caching and when does it help?",
        options: [
          "A. Saving prompt templates to a file on disk",
          "B. Providers reuse the attention KV cache for a stable prompt prefix, so repeated calls sharing that prefix are cheaper and faster",
          "C. Deduplicating identical outputs",
          "D. Compressing the user's query",
        ],
        answer: "B",
        explanation:
          "B is correct: when consecutive calls share a long static prefix (system prompt + instructions), the provider can reuse its precomputed KV cache, cutting cost and latency — provided the stable content comes before the dynamic query.",
      },
      {
        q: "Given 'lost in the middle', where should you place the most critical instruction in a long prompt?",
        options: [
          "A. Exactly in the middle for balance",
          "B. At the very beginning or the very end of the prompt",
          "C. Randomly, position does not matter",
          "D. Only in the retrieved documents",
        ],
        answer: "B",
        explanation:
          "B is correct: recall is highest at the boundaries, so put key constraints at the start (e.g., system prompt) or end of the message rather than burying them mid-context.",
      },
      {
        q: "Why is the context window described as NOT being persistent memory?",
        options: [
          "A. Because it stores data permanently in the model weights",
          "B. Because outside the window the model has no access to earlier text; long-term memory requires RAG or an external store",
          "C. Because it only holds the system prompt",
          "D. Because it resets every token",
        ],
        answer: "B",
        explanation:
          "B is correct: the window is transient working space for one call. Anything beyond it is invisible to the model, so durable memory must live in a vector database, key-value store, or saved summaries.",
      },
    ],
  },

  // -----------------------------------------------------------------
  {
    id: "ai-inference-sampling",
    title: "Inference & Sampling — Temperature, Top-P & Max Tokens",
    shortLabel: "Inference & Sampling",
    section: "AI Fundamentals",
    domain: "AI",
    tldr:
      "At each step an LLM outputs a probability distribution over the whole vocabulary, and a sampling strategy picks the next token. Temperature reshapes that distribution: 0 = greedy/deterministic (always the top token), 1 = proportional, >1 = flatter and more random. Top-p (nucleus) samples from the smallest set of tokens covering probability P; top-k limits to the K most likely. max_tokens caps output length (and cost). Use low temperature for code/JSON/facts, higher for creative writing — and don't push temperature and top-p to extremes at once.",
    subtopics: [
      {
        heading: "What inference actually does",
        bullets: [
          { icon: "🎲", text: "Each step the model emits a **probability distribution over the whole vocabulary** (~100k tokens); a **sampling strategy** chooses one token, then it repeats." },
          { icon: "🥇", text: "**Greedy decoding** (temperature 0) always takes the top token — deterministic and reproducible, but can fall into repetitive loops." },
          { icon: "🌀", text: "**Sampling** (temperature > 0) draws from the distribution — more diverse and creative, but non-deterministic and can introduce errors." },
        ],
      },
      {
        heading: "Temperature, top-p, top-k",
        bullets: [
          { icon: "🌡️", text: "**Temperature** scales the logits before softmax: **0** = pick the argmax, **1** = sample proportionally, **>1** = flatten so surprising tokens become likely." },
          { icon: "🎯", text: "**Top-p (nucleus)** keeps the smallest set of tokens whose cumulative probability ≥ P (e.g. 0.9), adapting the candidate count to the model's confidence." },
          { icon: "🔟", text: "**Top-k** limits sampling to the K most probable tokens; often combined with top-p. Prefer tuning **one** knob — don't push temperature and top-p to extremes together." },
        ],
      },
      {
        heading: "Practical settings & controls",
        bullets: [
          { icon: "🧊", text: "**Low temperature (0–0.3)** for factual Q&A, code, and **structured/JSON extraction** (you want deterministic, valid output)." },
          { icon: "🔥", text: "**Higher temperature (1.0–1.5)** for creative writing and brainstorming, where diversity is the goal." },
          { icon: "📏", text: "**max_tokens** caps output length — controls cost (you pay per output token), prevents runaway generation, and enforces format. Repetition/frequency/presence penalties curb loops." },
        ],
      },
    ],
    keyFacts: [
      { label: "temperature=0", value: "Greedy / deterministic", icon: "🧊" },
      { label: "temperature>1", value: "Flatter, more random", icon: "🔥" },
      { label: "top-p (nucleus)", value: "Smallest set covering P", icon: "🎯" },
      { label: "max_tokens", value: "Output cap + cost control", icon: "📏" },
    ],
    quickReference: {
      title: "Interview cues",
      icon: "🎯",
      bullets: [
        "'temperature=0?' → **greedy**, always the top token (deterministic).",
        "'JSON / code / facts?' → **low temperature (≈0)** for valid, consistent output.",
        "'Creative writing?' → **higher temperature (1.0+)** for diversity.",
        "'top-p?' → smallest token set whose cumulative prob ≥ P (nucleus).",
        "Tune temperature OR top-p — **not both to extremes**; cap length with max_tokens.",
      ],
      analogyBrief:
        "Inference is spinning a weighted roulette wheel one token at a time; temperature flattens or sharpens the weights, and top-p removes the tiniest slots before you spin.",
    },
    explanation:
      "During inference, at each generation step the language model produces a probability distribution over its entire vocabulary of roughly 100,000 tokens — for 'The capital of France is', 'Paris' might get 97% while 'Lyon', 'Rome' and thousands of others split the rest — and a sampling strategy decides which token to actually emit before the process repeats for the next position. Greedy decoding always takes the single highest-probability token, which is deterministic and reproducible (ideal for factual tasks) but can get stuck in repetitive loops and lacks diversity, whereas sampling draws a token from the distribution, producing more varied and creative output at the cost of determinism and the occasional error. Temperature is the main dial: it scales the logits (dividing them by the temperature) before the softmax, so a temperature of 0 collapses the distribution onto its argmax (greedy), a temperature of 1 samples in proportion to the model's raw probabilities, and a temperature above 1 flattens the distribution so that normally unlikely tokens become plausible, increasing randomness and 'creativity' but also errors; temperature below 1 sharpens toward the most likely tokens for more focused, deterministic output. Top-p, or nucleus sampling, instead restricts the candidates to the smallest set of tokens whose cumulative probability reaches P (for example, with top-p = 0.9, if the top three tokens already sum to 90% of the mass, only those three are considered), which dynamically adapts the number of candidates to how confident the model is; top-k is a simpler variant that limits sampling to the K most probable tokens and is often combined with top-p. A practical rule is to adjust temperature or top-p but not both to extreme values simultaneously, since they both control diversity and interact unpredictably. max_tokens sets a hard cap on how many tokens are generated, which matters for cost (you are billed per output token), for preventing runaway generation, and for enforcing format constraints, while repetition, frequency, and presence penalties reduce the probability of already-generated tokens to avoid loops. Matching the settings to the task is what matters most: use a temperature at or near 0 for factual question answering, code generation, and structured/JSON extraction where you need deterministic, valid, consistent output (randomness there tends to produce malformed JSON or wrong formats), and use a higher temperature around 1.0 to 1.5 for creative writing and brainstorming where diversity is the goal. Modern APIs also offer structured-output or JSON modes to further guarantee well-formed results.",
    analogy:
      "LLM inference is like spinning a weighted roulette wheel one token at a time, where each slot is a vocabulary word and the slot sizes are the model's probabilities. Temperature controls how flat or peaked those slots are: at temperature 0 the wheel is rigged so the ball always lands in the single biggest slot (greedy); at temperature 1 you spin honestly, landing in each slot in proportion to its size; at temperature 2 you shave the big slots down and enlarge the small ones so surprising words happen far more often. Top-p is a bouncer standing at the wheel who removes the smallest slots before you spin, keeping only enough of the largest ones to cover, say, 90% of the wheel — so you never land on a truly bizarre word. You are always sampling; you are just changing the shape of the wheel and which slots are allowed.",
    diagram: `<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Temperature reshaping the token probability distribution">${svgDefs}
      <text x="360" y="22" fill="#e6edf3" font-size="13" font-weight="700" text-anchor="middle">Temperature reshapes the next-token distribution</text>
      <rect x="30" y="45" width="210" height="200" rx="10" fill="#1a2332" stroke="#3b82f6"/>
      <text x="135" y="66" fill="#3b82f6" font-size="11" text-anchor="middle" font-weight="600">temperature = 0.2</text>
      <text x="135" y="82" fill="#8b949e" font-size="9" text-anchor="middle">deterministic</text>
      <rect x="70" y="110" width="26" height="90" rx="3" fill="#3b82f6"/>
      <rect x="110" y="185" width="26" height="15" rx="3" fill="#3b82f6" opacity="0.4"/>
      <rect x="150" y="193" width="26" height="7" rx="3" fill="#3b82f6" opacity="0.3"/>
      <rect x="190" y="196" width="26" height="4" rx="3" fill="#3b82f6" opacity="0.25"/>
      <text x="135" y="228" fill="#22c55e" font-size="10" text-anchor="middle">almost always "Paris"</text>
      <rect x="255" y="45" width="210" height="200" rx="10" fill="#1a2332" stroke="#22c55e"/>
      <text x="360" y="66" fill="#22c55e" font-size="11" text-anchor="middle" font-weight="600">temperature = 1.0</text>
      <text x="360" y="82" fill="#8b949e" font-size="9" text-anchor="middle">balanced</text>
      <rect x="295" y="130" width="26" height="70" rx="3" fill="#22c55e"/>
      <rect x="335" y="160" width="26" height="40" rx="3" fill="#22c55e" opacity="0.7"/>
      <rect x="375" y="175" width="26" height="25" rx="3" fill="#22c55e" opacity="0.5"/>
      <rect x="415" y="182" width="26" height="18" rx="3" fill="#22c55e" opacity="0.4"/>
      <text x="360" y="228" fill="#22c55e" font-size="10" text-anchor="middle">usually "Paris", sometimes others</text>
      <rect x="480" y="45" width="210" height="200" rx="10" fill="#1a2332" stroke="#f59e0b"/>
      <text x="585" y="66" fill="#f59e0b" font-size="11" text-anchor="middle" font-weight="600">temperature = 2.0</text>
      <text x="585" y="82" fill="#8b949e" font-size="9" text-anchor="middle">random</text>
      <rect x="520" y="150" width="26" height="50" rx="3" fill="#f59e0b" opacity="0.8"/>
      <rect x="560" y="140" width="26" height="60" rx="3" fill="#f59e0b"/>
      <rect x="600" y="148" width="26" height="52" rx="3" fill="#f59e0b" opacity="0.8"/>
      <rect x="640" y="155" width="26" height="45" rx="3" fill="#f59e0b" opacity="0.7"/>
      <text x="585" y="228" fill="#f59e0b" font-size="10" text-anchor="middle">any token becomes possible</text>
    </svg>`,
    diagramLegend: [
      { color: "#3b82f6", label: "Low temperature", description: "Sharp distribution → deterministic, top token dominates." },
      { color: "#22c55e", label: "Temperature ≈ 1", description: "Sample in proportion to the model's raw probabilities." },
      { color: "#f59e0b", label: "High temperature", description: "Flattened distribution → surprising tokens become likely." },
    ],
    codeExample: {
      language: "python",
      title: "Temperature scaling of a distribution",
      code: `import numpy as np

def apply_temperature(logits, temperature):
    if temperature == 0:                       # greedy: one-hot on the argmax
        p = np.zeros_like(logits); p[np.argmax(logits)] = 1.0
        return p
    scaled = logits / temperature              # divide logits by temperature
    e = np.exp(scaled - scaled.max())
    return e / e.sum()                         # softmax -> probabilities

logits = np.array([5.0, 2.0, 1.0, 0.5])        # "Paris", "Lyon", "Rome", "Berlin"
for t in (0.2, 1.0, 2.0):
    print(f"T={t}: {apply_temperature(logits, t).round(3)}")
# Lower T -> peakier (Paris dominates); higher T -> flatter (others catch up).`,
    },
    codeExamples: [
      {
        language: "python",
        tab: "Temperature",
        title: "How temperature reshapes probabilities",
        code: `import numpy as np

def softmax_with_temp(logits, t):
    scaled = logits / t
    e = np.exp(scaled - scaled.max())
    return e / e.sum()

logits = np.array([5.0, 2.0, 1.0, 0.5])         # Paris, Lyon, Rome, Berlin
for t in (0.2, 1.0, 2.0):
    p = softmax_with_temp(logits, t)
    print(f"T={t:<4} Paris={p[0]:.2f}  Lyon={p[1]:.2f}  Rome={p[2]:.2f}  Berlin={p[3]:.2f}")

# T=0.2  Paris=1.00  Lyon=0.00  Rome=0.00  Berlin=0.00   (near-greedy)
# T=1.0  Paris=0.84  Lyon=0.04  Rome=0.02  Berlin=0.01
# T=2.0  Paris=0.53  Lyon=0.12  Rome=0.07  Berlin=0.06   (flattened)`,
      },
      {
        language: "python",
        tab: "Top-p / top-k",
        title: "Nucleus (top-p) and top-k filtering",
        code: `import numpy as np

def top_p_filter(probs, p=0.9):
    order = np.argsort(probs)[::-1]             # most -> least likely
    cumulative, keep = 0.0, []
    for idx in order:
        keep.append(idx)
        cumulative += probs[idx]
        if cumulative >= p:                     # smallest set covering p
            break
    return keep

def top_k_filter(probs, k=2):
    return list(np.argsort(probs)[::-1][:k])    # K most likely tokens

probs = np.array([0.6, 0.25, 0.1, 0.05])
print("top-p=0.9 keeps indices:", top_p_filter(probs, 0.9))   # [0, 1] (0.85<0.9 -> +[2])
print("top-k=2  keeps indices:", top_k_filter(probs, 2))      # [0, 1]
# Tune temperature OR top-p; pushing both to extremes interacts unpredictably.`,
      },
      {
        language: "python",
        tab: "API params",
        title: "Match settings to the task",
        code: `from anthropic import Anthropic
client = Anthropic()

def extract_json(prompt: str):
    return client.messages.create(
        model="claude-sonnet-5",
        max_tokens=512,        # hard output cap -> controls cost & runaway output
        temperature=0,         # deterministic -> valid, consistent JSON
        messages=[{"role": "user", "content": prompt}],
    )

def brainstorm(prompt: str):
    return client.messages.create(
        model="claude-sonnet-5",
        max_tokens=512,
        temperature=1.2,       # higher -> diverse, creative ideas
        messages=[{"role": "user", "content": prompt}],
    )
# Structured extraction/code/facts -> temp ~0; creative writing -> temp 1.0+.`,
      },
    ],
    problemStatement:
      "A pipeline that extracts structured JSON from documents intermittently produces malformed JSON and inconsistent field values, and it was configured with temperature 1.0 plus top_p 0.95. Meanwhile a marketing tool that should generate varied taglines keeps returning nearly identical output at temperature 0. Explain what temperature and top-p do, why each system is misconfigured, and the exact settings you would use for each — and why tuning both knobs to extremes is a mistake.",
    questions: [
      {
        q: "What does temperature = 0 do during sampling?",
        options: [
          "A. Makes the model respond faster",
          "B. Makes the model always pick the highest-probability token (greedy / deterministic)",
          "C. Disables the model",
          "D. Forces shorter outputs",
        ],
        answer: "B",
        explanation:
          "B is correct: as temperature approaches 0 the distribution collapses onto the argmax, so the model deterministically picks the top token — ideal for factual Q&A, code, and structured extraction.",
      },
      {
        q: "What is top-p (nucleus) sampling?",
        options: [
          "A. Sampling only the top P tokens by their index position",
          "B. Sampling from the smallest set of tokens whose cumulative probability reaches P, adapting the candidate count to the model's confidence",
          "C. Always keeping exactly the top P percent of tokens",
          "D. Removing any token whose probability is below P",
        ],
        answer: "B",
        explanation:
          "B is correct: top-p forms a 'nucleus' of the most probable tokens that together reach probability mass P (e.g. 0.9). If the top few already cover P, only they remain; if the model is unsure, more tokens are included.",
      },
      {
        q: "For structured JSON extraction, what temperature should you use and why?",
        options: [
          "A. 1.5, for creativity",
          "B. 0.7 as a universal default",
          "C. 0 (or very close), because you want deterministic, consistent, highest-probability output; randomness causes malformed JSON",
          "D. 2.0, for diversity",
        ],
        answer: "C",
        explanation:
          "C is correct: structured/deterministic tasks need temperature ≈ 0 so output is reproducible and well-formed. High temperature injects randomness that produces invalid JSON or inconsistent fields.",
      },
      {
        q: "What is the effect of raising temperature above 1?",
        options: [
          "A. It makes the model deterministic",
          "B. It flattens the probability distribution, making normally unlikely tokens more probable — more random/creative but more error-prone",
          "C. It reduces the vocabulary size",
          "D. It has no effect above 1",
        ],
        answer: "B",
        explanation:
          "B is correct: dividing logits by a temperature greater than 1 flattens the softmax, so surprising tokens gain probability, increasing diversity and creativity at the cost of more mistakes.",
      },
      {
        q: "Why is it discouraged to push BOTH temperature and top_p to extreme values simultaneously?",
        options: [
          "A. It always crashes the API",
          "B. Both control sampling diversity and interact unpredictably; adjust one at a time for controllable behavior",
          "C. It doubles the cost per token",
          "D. top_p only works when temperature is exactly 1",
        ],
        answer: "B",
        explanation:
          "B is correct: temperature and top-p both shape how diverse sampling is, so combining extremes makes behavior hard to reason about. Providers generally recommend tuning one knob at a time.",
      },
      {
        q: "What does the max_tokens parameter control?",
        options: [
          "A. The model's context window size",
          "B. A hard cap on the number of generated output tokens — controlling cost, preventing runaway generation, and helping enforce format",
          "C. The temperature ceiling",
          "D. The number of attention heads used",
        ],
        answer: "B",
        explanation:
          "B is correct: max_tokens limits how many tokens the model may generate. Since you pay per output token, it controls cost, stops runaway output, and supports format constraints; it is not the context window or a sampling knob.",
      },
    ],
  },
];
