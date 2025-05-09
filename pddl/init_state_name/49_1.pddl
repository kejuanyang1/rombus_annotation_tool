(define (problem scene1)
  (:domain manip)
  (:objects
    long red block_1 - support
    long red block_2 - support
    small yellow triangular prism - item
    long green block - support
    flat green block_1 - support
    flat green block_2 - support
    green basket - container
  )
  (:init
    (ontable flat green block_1)
    (ontable flat green block_2)
    (in long red block_1 green basket)
    (in long red block_2 green basket)
    (on small yellow triangular prism long green block)
    (ontable long green block)
    (clear small yellow triangular prism)
    (clear flat green block_1)
    (clear flat green block_2)
    (clear long green block)
    (handempty)
  )
  (:goal (and ))
)