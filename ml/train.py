import tensorflow as tf
import numpy as np

print("Training dummy recommendation model...")

model = tf.keras.Sequential([
    tf.keras.layers.Dense(10, activation='relu', input_shape=(5,)),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy')
X = np.random.rand(100, 5)
y = np.random.randint(0, 2, 100)
model.fit(X, y, epochs=2)

print("Training complete. (Demo model)")
