(define (problem scene1)
  (:domain manip)
  (:objects
    small red triangular prism_1 small red triangular prism_2 red cylinder small yellow triangular prism long blue block_1 long blue block_2 long green block - item
    yellow basket - container
  )
  (:init
    (ontable small yellow triangular prism)
    (ontable long blue block_1)
    (ontable long blue block_2)
    (ontable long green block)
    (in small red triangular prism_1 yellow basket)
    (in red cylinder yellow basket)
    (clear small yellow triangular prism)
    (clear long blue block_1)
    (clear long blue block_2)
    (clear long green block)
    (handempty)
  )
  (:goal (and ))
)